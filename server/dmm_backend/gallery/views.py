from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from dmm_backend.mongo import db
from django.utils import timezone
from bson.objectid import ObjectId
import os
from urllib.parse import urlparse


class GalleryImageAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, mongo_id=None):
        images_collection = db["gallery_images"]
        try:
            if mongo_id:
                media = images_collection.find_one({"_id": ObjectId(mongo_id)})
                if not media:
                    return Response({"error": "Media not found"}, status=status.HTTP_404_NOT_FOUND)

                media["_id"] = str(media["_id"])

                # backward compatibility
                if "image_url" in media and "media_url" not in media:
                    media["media_type"] = "image"
                    media["media_url"] = media["image_url"]

                return Response(media)

            else:
                medias = list(images_collection.find({}).sort("created_at", -1))
                for m in medias:
                    m["_id"] = str(m["_id"])
                    if "image_url" in m and "media_url" not in m:
                        m["media_type"] = "image"
                        m["media_url"] = m["image_url"]
                return Response(medias)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        images_collection = db["gallery_images"]

        media_file = request.FILES.get("media")
        title = request.data.get("title")

        if not media_file or not title:
            return Response(
                {"error": "Title and media file are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        content_type = media_file.content_type

        if content_type.startswith("image/"):
            media_type = "image"
            folder = "gallery/images"
            allowed_ext = [".jpg", ".jpeg", ".png", ".webp"]
            max_size = 5 * 1024 * 1024
        elif content_type.startswith("video/"):
            media_type = "video"
            folder = "gallery/videos"
            allowed_ext = [".mp4", ".webm", ".mov"]
            max_size = 50 * 1024 * 1024
        else:
            return Response({"error": "Unsupported file type"}, status=status.HTTP_400_BAD_REQUEST)

        ext = os.path.splitext(media_file.name)[1].lower()
        if ext not in allowed_ext:
            return Response({"error": "Invalid file format"}, status=status.HTTP_400_BAD_REQUEST)

        if media_file.size > max_size:
            return Response({"error": "File too large"}, status=status.HTTP_400_BAD_REQUEST)

        media_dir = os.path.join(settings.MEDIA_ROOT, folder)
        os.makedirs(media_dir, exist_ok=True)

        file_path = os.path.join(media_dir, media_file.name)

        with open(file_path, "wb+") as f:
            for chunk in media_file.chunks():
                f.write(chunk)

        relative_path = f"{settings.MEDIA_URL}{folder}/{media_file.name}"
        full_url = request.build_absolute_uri(relative_path)

        data = {
            "title": title,
            "media_type": media_type,
            "media_url": full_url,
            "created_at": timezone.now().isoformat()
        }

        result = images_collection.insert_one(data)

        return Response(
            {
                "message": "Media uploaded successfully!",
                "_id": str(result.inserted_id),
                "media_type": media_type,
                "media_url": full_url
            },
            status=status.HTTP_201_CREATED
        )

    def patch(self, request, mongo_id):
        images_collection = db["gallery_images"]

        try:
            media = images_collection.find_one({"_id": ObjectId(mongo_id)})
            if not media:
                return Response({"error": "Media not found"}, status=status.HTTP_404_NOT_FOUND)

            update_data = {}
            title = request.data.get("title")
            media_file = request.FILES.get("media")

            if title:
                update_data["title"] = title

            if media_file:
                content_type = media_file.content_type

                if content_type.startswith("image/"):
                    media_type = "image"
                    folder = "gallery/images"
                    allowed_ext = [".jpg", ".jpeg", ".png", ".webp"]
                    max_size = 5 * 1024 * 1024
                elif content_type.startswith("video/"):
                    media_type = "video"
                    folder = "gallery/videos"
                    allowed_ext = [".mp4", ".webm", ".mov"]
                    max_size = 50 * 1024 * 1024
                else:
                    return Response({"error": "Unsupported file type"}, status=400)

                ext = os.path.splitext(media_file.name)[1].lower()
                if ext not in allowed_ext:
                    return Response({"error": "Invalid file format"}, status=400)

                if media_file.size > max_size:
                    return Response({"error": "File too large"}, status=400)

                media_dir = os.path.join(settings.MEDIA_ROOT, folder)
                os.makedirs(media_dir, exist_ok=True)

                file_path = os.path.join(media_dir, media_file.name)

                with open(file_path, "wb+") as f:
                    for chunk in media_file.chunks():
                        f.write(chunk)

                relative_path = f"{settings.MEDIA_URL}{folder}/{media_file.name}"
                full_url = request.build_absolute_uri(relative_path)

                update_data.update({
                    "media_type": media_type,
                    "media_url": full_url
                })

                # delete old file
                old_url = media.get("media_url") or media.get("image_url")
                if old_url:
                    old_name = os.path.basename(old_url)
                    old_folder = "gallery/videos" if media.get("media_type") == "video" else "gallery/images"
                    old_path = os.path.join(settings.MEDIA_ROOT, old_folder, old_name)
                    if os.path.exists(old_path):
                        os.remove(old_path)

            if not update_data:
                return Response({"error": "No valid fields to update"}, status=status.HTTP_400_BAD_REQUEST)

            images_collection.update_one(
                {"_id": ObjectId(mongo_id)},
                {"$set": update_data}
            )

            media.update(update_data)
            media["_id"] = str(media["_id"])

            return Response(
                {"message": "Media updated successfully!", "media": media},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, mongo_id):
        images_collection = db["gallery_images"]

        try:
            media = images_collection.find_one({"_id": ObjectId(mongo_id)})
            if not media:
                return Response({"error": "Media not found"}, status=status.HTTP_404_NOT_FOUND)

            media_url = media.get("media_url") or media.get("image_url")
            if media_url:
                filename = os.path.basename(media_url)
                folder = "gallery/videos" if media.get("media_type") == "video" else "gallery/images"
                file_path = os.path.join(settings.MEDIA_ROOT, folder, filename)
                if os.path.exists(file_path):
                    os.remove(file_path)

            images_collection.delete_one({"_id": ObjectId(mongo_id)})
            return Response({"message": "Media deleted successfully!"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
