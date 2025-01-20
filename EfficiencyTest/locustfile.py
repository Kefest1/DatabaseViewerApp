import random

from locust import task, constant, HttpUser, between

api_host = "http://localhost:8080/api"

def generate_unique_username():
    return f"delete_{random.randint(1000, 999999)}"


def generate_unique_email():
    return f"delete_{random.randint(1000, 999999)}@example.com"


def generate_unique_password():
    return f"delete_{random.randint(1000, 999999)}"

def generate_random_tablename():
    table_names = [
        "categories",
        "customers",
        "employees",
        "products",
        "orders",
        "orderdetails",
        "shippers",
        "suppliers",
    ]
    return table_names[random.randint(0, len(table_names) - 1)]


class Testing_user_api(HttpUser):
    host = api_host
    wait_time = between(1, 3)


    @task(4)
    def simulate_login(self):
        self.client.get("/userinfo/getByUsername", params={"userName": "user1", "password": "pass1"})

    @task(2)
    def simulate_getting_subordinates(self):
        self.client.get("/userinfo/getsubordinates/user1")

    @task(1)
    def simulate_registering(self):
        self.client.post("/userinfo/add", json={"username": generate_unique_username(),
                                       "password_hash": generate_unique_password(),
                                       "email": generate_unique_email(),
                                       "hash": "",
                                       "adminName": "user1"})


class Testing_data_fetching(HttpUser):
    host = api_host
    wait_time = between(1, 3)

    @task(1)
    def simulate_getting_table_content(self):

        request_body = {
            "database": "northwind",
            "table": f"{generate_random_tablename()}"
        }

        self.client.post(
            "/tableinfo/getAllFieldsAllColumns",
            json=request_body
        )

    @task(3)
    def simulate_getting_table_folder_map(self):
        self.client.get(f"/databaseinfo/getfoldermap/user1")
