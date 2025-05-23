from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

# used for registering new users
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': True}
        }

    # runs built-in Django password checks
    def validate_password(self, value):
        validate_password(value, user=User(**self.initial_data))
        return value

    # actually creates the user instance
    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            role=validated_data['role'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# extends default JWT token serializer to include role
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role  # attach role to token payload
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role  # return role in response too
        return data
