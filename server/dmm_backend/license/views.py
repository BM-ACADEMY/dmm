from urllib.parse import quote_plus
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from bson import ObjectId
from dmm_backend.mongo import db
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser, FormParser

dmm_collection = db["dmm_members"] if db is not None else None


class dmmViewSet(viewsets.ViewSet):
    http_method_names = ["get", "post", "delete"]

    # ----------------------------------------------------
    # LIST ALL
    # ----------------------------------------------------
    def list(self, request):
        if dmm_collection is None:
            return Response({"error": "MongoDB not connected"}, status=503)

        data = list(dmm_collection.find())
        for item in data:
            item["_id"] = str(item["_id"])
        return Response(data)

    # ----------------------------------------------------
    # RETRIEVE SINGLE
    # ----------------------------------------------------
    def retrieve(self, request, pk=None):
        if dmm_collection is None:
            return Response({"error": "MongoDB not connected"}, status=503)

        try:
            doc = dmm_collection.find_one({"_id": ObjectId(pk)})
        except:
            return Response({"error": "Invalid ID"}, status=400)

        if not doc:
            return Response({"error": "Record not found"}, status=404)

        doc["_id"] = str(doc["_id"])
        return Response(doc)

    # ----------------------------------------------------
    # CREATE MEMBER
    # ----------------------------------------------------
    def create(self, request):
        if dmm_collection is None:
            return Response({"error": "MongoDB not connected"}, status=503)

        data = dict(request.data)
        phone = data.get("phone")

        if not phone:
            return Response({"error": "Phone number is required"}, status=400)

        # Check duplicate
        exists = dmm_collection.find_one({"phone": phone})
        if exists:
            return Response(
                {"error": "This phone number is already registered."},
                status=400,
            )

        # Photo upload
        photo = request.FILES.get("photo")
        photo_path = None
        if photo:
            photo_path = default_storage.save(f"dmm/photos/{photo.name}", photo)

        member_doc = {
            "name": data.get("name"),
            "gender": data.get("gender"),
            "education": data.get("education"),
            "constituency": data.get("constituency"),
            "phone": phone,
            "address": data.get("address"),
            "photo": request.build_absolute_uri(f"/media/{photo_path}") if photo_path else None,
            "is_approved": False,
            "certificate_pdf": None,
        }

        result = dmm_collection.insert_one(member_doc)
        member_doc["_id"] = str(result.inserted_id)

        return Response(member_doc, status=201)

    # ----------------------------------------------------
    # DELETE MEMBER
    # ----------------------------------------------------
    def destroy(self, request, pk=None):
        if dmm_collection is None:
            return Response({"error": "MongoDB not connected"}, status=503)

        dmm_collection.delete_one({"_id": ObjectId(pk)})
        return Response({"message": "Record deleted"}, status=204)

    # ----------------------------------------------------
    # APPROVE + UPLOAD PDF
    # ----------------------------------------------------
    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser, FormParser])
    def upload_pdf(self, request, pk=None):
        if dmm_collection is None:
            return Response({"error": "MongoDB not connected"}, status=503)

        # Find record
        try:
            doc = dmm_collection.find_one({"_id": ObjectId(pk)})
        except:
            return Response({"error": "Invalid ID"}, status=400)

        if not doc:
            return Response({"error": "Record not found"}, status=404)

        # Uploaded file
        pdf_file = request.FILES.get("pdf_file")
        if not pdf_file:
            return Response({"error": "pdf_file is required"}, status=400)

        if pdf_file.content_type != "application/pdf":
            return Response({"error": "Only PDF allowed"}, status=400)

        # Unique filename
        raw_name = doc.get("name", "member")
        safe_name = "".join(c for c in raw_name if c.isalnum() or c in " _-").strip()
        if not safe_name:
            safe_name = "member"

        unique_id = str(ObjectId())
        file_name = f"dmm_CERT_{safe_name}_{unique_id}.pdf"
        file_path = f"dmm/generated/{file_name}"

        # Save file
        saved_path = default_storage.save(file_path, pdf_file)
        pdf_url = request.build_absolute_uri(f"/media/{saved_path}")

        # Update DB
        dmm_collection.update_one(
            {"_id": ObjectId(pk)},
            {"$set": {"is_approved": True, "certificate_pdf": pdf_url}},
        )

        # WhatsApp message
        message = (
            f"🎉 Hello {doc['name']}!\n\n"
            f"Your dmm certificate is approved! 🏅\n\n"
            f"📄 Download certificate:\n{pdf_url}\n\n"
            f"Thank you!"
        )

        encoded_text = quote_plus(message, safe=':/')
        whatsapp_link = f"https://api.whatsapp.com/send?phone=91{doc['phone']}&text={encoded_text}"

        return Response({
            "message": "Certificate uploaded & approved!",
            "pdf_url": pdf_url,
            "whatsapp_link": whatsapp_link,
        })

    # ----------------------------------------------------
    # CHECK PHONE
    # ----------------------------------------------------
    @action(detail=False, methods=["get"])
    def check_phone(self, request):
        if dmm_collection is None:
            return Response({"error": "MongoDB not connected"}, status=503)

        phone = request.GET.get("phone")
        if not phone:
            return Response({"available": False, "message": "Phone number required"}, status=400)

        exists = dmm_collection.find_one({"phone": phone})

        if exists:
            return Response({"available": False, "message": "Phone already registered"})

        return Response({"available": True, "message": "Phone available"})

    # ----------------------------------------------------
    # PUBLIC DOWNLOAD CERTIFICATE
    # ----------------------------------------------------
    @action(detail=False, methods=["get"])
    def download(self, request):
        if dmm_collection is None:
            return Response({"error": "MongoDB not connected"}, status=503)

        phone = request.GET.get("phone")
        if not phone:
            return Response({"error": "Phone number required"}, status=400)

        doc = dmm_collection.find_one({"phone": phone})

        if not doc:
            return Response({"error": "Record not found"}, status=404)

        if not doc.get("is_approved"):
            return Response({"error": "Certificate not approved yet"}, status=400)

        pdf_url = doc.get("certificate_pdf")
        if not pdf_url:
            return Response({"error": "Certificate file missing"}, status=404)

        try:
            rel_path = pdf_url.split("/media/")[-1]
            with default_storage.open(rel_path, "rb") as f:
                response = HttpResponse(f.read(), content_type="application/pdf")
                response["Content-Disposition"] = "attachment; filename=dmm_certificate.pdf"
                return response

        except:
            return Response({"error": "Error reading certificate file"}, status=500)
