from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from users.serializers import UserSerializer

# check password validation rules in the serializer
class UserSerializerPasswordTests(TestCase):
    def test_password_too_short(self):
        # should fail – password is too short
        data = {
            'username': 'testuser',
            'password': 'short',
            'role': 'farmer'
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
        msg = serializer.errors['password'][0].lower()
        self.assertIn('too short', msg)

    def test_password_exactly_minimum(self):
        # should pass – password is 8+ and meets validation
        data = {
            'username': 'testuser2',
            'password': 'GoodPass1',
            'role': 'retailer'
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())

# check actual endpoints for register and login
class AuthEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')

    def test_register_endpoint(self):
        # should create a new user
        resp = self.client.post(self.register_url, {
            'username': 'alice',
            'password': 'GoodPass1',
            'role': 'farmer'
        }, format='json')
        self.assertEqual(resp.status_code, 201)
        self.assertIn('id', resp.data)

    def test_cookie_login_sets_cookies_and_returns_role(self):
        # 1) register user
        self.client.post(self.register_url, {
            'username': 'bob',
            'password': 'GoodPass1',
            'role': 'retailer'
        }, format='json')

        # 2) login and check response
        resp = self.client.post(self.login_url, {
            'username': 'bob',
            'password': 'GoodPass1'
        }, format='json')

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data.get('role'), 'retailer')

        # check httpOnly cookies set
        self.assertIn('access_token', resp.cookies)
        self.assertTrue(resp.cookies['access_token']['httponly'])
        self.assertIn('refresh_token', resp.cookies)
