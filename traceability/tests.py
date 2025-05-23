from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import FoodItem, TransportLog
from .serializers import FoodItemSerializer, TransportLogSerializer

User = get_user_model()

# --------------------------
# Serializer Validation Tests
# --------------------------
class SerializerValidationTests(APITestCase):
    def setUp(self):
        self.farmer = User.objects.create_user(
            username='farmer1', password='GoodPass1', role='farmer'
        )
        self.retailer = User.objects.create_user(
            username='retailer1', password='GoodPass1', role='retailer'
        )

    def test_fooditem_missing_required_fields(self):
        serializer = FoodItemSerializer(data={})
        self.assertFalse(serializer.is_valid())
        for field in ('name', 'origin', 'batch_number'):
            self.assertIn(field, serializer.errors)

    def test_fooditem_invalid_data_types(self):
        data = {'name': ['bad'], 'origin': True, 'batch_number': {'x': 'y'}}
        serializer = FoodItemSerializer(data=data)
        self.assertFalse(serializer.is_valid())

    def test_fooditem_length_boundaries(self):
        valid = {'name': 'T', 'origin': 'O', 'batch_number': 'B' * 20}
        s = FoodItemSerializer(data=valid)
        self.assertTrue(s.is_valid(), msg=s.errors)
        invalid = {'name': 'T', 'origin': 'O', 'batch_number': 'B' * 21}
        s = FoodItemSerializer(data=invalid)
        self.assertFalse(s.is_valid())
        self.assertIn('batch_number', s.errors)

    def test_fooditem_duplicate_batch_number(self):
        FoodItem.objects.create(
            name='Apple', origin='FarmA', batch_number='DUP01', farmer=self.farmer
        )
        dup = {'name': 'Banana', 'origin': 'FarmB', 'batch_number': 'DUP01'}
        s = FoodItemSerializer(data=dup)
        self.assertFalse(s.is_valid())
        self.assertIn('batch_number', s.errors)

    def test_transportlog_missing_required_fields(self):
        serializer = TransportLogSerializer(data={})
        self.assertFalse(serializer.is_valid())
        for field in ('food_item', 'transport_date', 'vehicle_details', 'destination'):
            self.assertIn(field, serializer.errors)

    def test_transportlog_read_only_retailer(self):
        fi = FoodItem.objects.create(
            name='Carrot', origin='Valley', batch_number='CAR001', farmer=self.farmer
        )
        data = {
            'food_item': fi.id,
            'transport_date': '2025-05-22T10:00:00Z',
            'vehicle_details': 'TruckX',
            'destination': 'Market',
            'on_shelf': False
        }
        s = TransportLogSerializer(data=data)
        self.assertTrue(s.is_valid(), msg=s.errors)
        inst = s.save(retailer=self.retailer)
        self.assertEqual(inst.retailer, self.retailer)

# --------------------------
# Permission & Access Tests
# --------------------------
class PermissionEndpointTests(APITestCase):
    def setUp(self):
        self.client = self.client
        self.farmer = User.objects.create_user(
            username='farmer2', password='GoodPass1', role='farmer'
        )
        self.retailer = User.objects.create_user(
            username='retailer2', password='GoodPass1', role='retailer'
        )

    def test_farmer_can_create_food_but_retailer_cannot(self):
        url = reverse('fooditem-list')

        # Farmer should succeed
        self.client.force_authenticate(user=self.farmer)
        resp = self.client.post(url, {
            'name': 'X', 'origin': 'Y', 'batch_number': 'FARM123'
        }, format='json')
        self.assertEqual(resp.status_code, 201)

        # Retailer should be forbidden
        self.client.force_authenticate(user=self.retailer)
        resp = self.client.post(url, {
            'name': 'A', 'origin': 'B', 'batch_number': 'RET123'
        }, format='json')
        self.assertEqual(resp.status_code, 403)

    def test_retailer_can_create_log_but_farmer_cannot(self):
        food_url = reverse('fooditem-list')
        self.client.force_authenticate(user=self.farmer)
        create_resp = self.client.post(food_url, {
            'name': 'G', 'origin': 'H', 'batch_number': 'LOG123'
        }, format='json')
        self.assertEqual(create_resp.status_code, 201)
        item_id = create_resp.data['id']

        log_url = reverse('transportlog-list')

        # Retailer creates log
        self.client.force_authenticate(user=self.retailer)
        resp = self.client.post(log_url, {
            'food_item': item_id,
            'transport_date': '2025-05-22T12:00:00Z',
            'vehicle_details': 'TruckY',
            'destination': 'StoreZ'
        }, format='json')
        self.assertEqual(resp.status_code, 201)

        # Farmer tries to create log (should be forbidden)
        self.client.force_authenticate(user=self.farmer)
        resp = self.client.post(log_url, {
            'food_item': item_id,
            'transport_date': '2025-05-22T12:00:00Z',
            'vehicle_details': 'TruckY',
            'destination': 'StoreZ'
        }, format='json')
        self.assertEqual(resp.status_code, 403)

# --------------------------
# API Root Endpoint Test
# --------------------------
class APIRootTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='rootuser',
            password='GoodPass1',
            role='farmer'
        )
        self.client.force_authenticate(user=self.user)

    def test_api_root(self):
        resp = self.client.get(reverse('api-root'))
        self.assertEqual(resp.status_code, 200)
        self.assertIn('food-items', resp.data)
        self.assertIn('transport-logs', resp.data)
