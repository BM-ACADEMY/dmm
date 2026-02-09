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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        complaint = serializer.save()

        # Mongo sync
        db = get_db()
        if db:
            try:
                db.complaints.insert_one({
                    "name": complaint.name,
                    "phone": complaint.phone,
                    "email": complaint.email,
                    "subject": complaint.subject,
                    "message": complaint.message,
                    "created_at": datetime.utcnow(),
                })
            except Exception as e:
                print("Mongo error:", e)

        # 🔥 RETURN SIMPLE RESPONSE (no serializer.data)
        return Response(
            {"message": "Complaint submitted successfully"},
            status=201
        )

