from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Complaint
from .serializers import ComplaintSerializer
from django.conf import settings
from datetime import datetime
from dmm_backend.db import get_db

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            # 1. Standard Create Logic (SQLite)
            response = super().create(request, *args, **kwargs)
            
            # 2. Attempt MongoDB Sync (Best Effort)
            try:
                # If we get here, SQLite save was successful.
                # Use the serialized data from the response.
                data = response.data
                db = get_db()
                if db:
                    db.complaints.insert_one({
                        "name": data.get("name"),
                        "phone": data.get("phone"),
                        "email": data.get("email"),
                        "subject": data.get("subject"),
                        "message": data.get("message"),
                        "created_at": datetime.utcnow(),
                    })
                    if settings.DEBUG:
                        print("✅ Complaint also saved to MongoDB")
            except Exception as e:
                # Log error but do NOT fail the request
                print(f"⚠️ Failed to save complaint in MongoDB (Ignored): {e}")

            return response

        except Exception as e:
            # Catch-all for any other crashes
            print(f"❌ Critical Error in Complaint Submission: {e}")
            from rest_framework.response import Response
            from rest_framework import status
            return Response(
                {"error": "Internal Server Error during submission."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        # Just standard save, MongoDB logic moved to create() for safety
        serializer.save()
