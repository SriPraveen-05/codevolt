from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from app.config import MONGODB_URI, MONGODB_DB_NAME
from app.models.vehicle import Vehicle, VehicleIssue
from app.models.user import User
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class MongoDBService:
    def __init__(self):
        self.client = None
        self.db = None

    async def connect(self):
        try:
            self.client = AsyncIOMotorClient(MONGODB_URI)
            self.db = self.client[MONGODB_DB_NAME]
            # Ping the database to check connection
            await self.client.admin.command('ping')
            logger.info("Connected to MongoDB")
        except ConnectionFailure:
            logger.error("Failed to connect to MongoDB")
            raise

    async def close(self):
        if self.client:
            self.client.close()
            logger.info("Closed MongoDB connection")

    # User methods
    async def create_user(self, user: User):
        user_dict = user.dict(exclude={"id"})
        result = await self.db.users.insert_one(user_dict)
        return str(result.inserted_id)

    async def get_user_by_email(self, email: str):
        user = await self.db.users.find_one({"email": email})
        if user:
            user["id"] = str(user["_id"])
            return User(**user)
        return None

    # Vehicle methods
    async def create_vehicle(self, vehicle: Vehicle):
        vehicle_dict = vehicle.dict(exclude={"id"})
        result = await self.db.vehicles.insert_one(vehicle_dict)
        return str(result.inserted_id)

    async def get_vehicles_by_user(self, user_id: str):
        cursor = self.db.vehicles.find({"user_id": user_id})
        vehicles = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            vehicles.append(Vehicle(**doc))
        return vehicles

    async def get_vehicle(self, vehicle_id: str):
        vehicle = await self.db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
        if vehicle:
            vehicle["id"] = str(vehicle["_id"])
            return Vehicle(**vehicle)
        return None

    # Vehicle issue methods
    async def add_issue_to_vehicle(self, vehicle_id: str, issue: VehicleIssue):
        issue_dict = issue.dict(exclude={"id"})
        issue_id = str(ObjectId())
        issue_dict["id"] = issue_id
        
        result = await self.db.vehicles.update_one(
            {"_id": ObjectId(vehicle_id)},
            {"$push": {"issues": issue_dict}}
        )
        
        if result.modified_count == 1:
            return issue_id
        return None

# Create a singleton instance
mongodb_service = MongoDBService()