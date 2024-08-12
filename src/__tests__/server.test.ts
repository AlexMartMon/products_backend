import request from "supertest";
import server from "../server";

describe("POST /", () => {
  it('Should display validation errors', async () => {
    const response = await request(server).post("/").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(4);

    
    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(1);
  });
  it('Should validate that price is greater than 0', async () => {
    const data = {name: "mouse test", price: -1};
    const response = await request(server).post("/").send(data);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);

    
    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4);
  });
  it('Should validate that price is numeric', async () => {
    const data = {name: "mouse test", price: "hello testing"};
    const response = await request(server).post("/").send(data);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(2);

    
    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(1);
  });
  it("should create a new product", async () => {
    const data = {name: "mouse test", price: 20};
    const response = await request(server).post("/").send(data);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('error');
  });
});

describe("GET /", () => {
  it('Should exist URL get products', async () => {
    const response = await request(server).get("/");
    expect(response.status).not.toBe(404);
  });
  it('GET a json response with products', async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('data');
    expect(response.body).not.toHaveProperty('errors');
  });
});

describe("GET /:id", () => {
  it("Should return a 404 response for a non-existent product", async () => {
    const productID = 500000;
    const response = await request(server).get(`/${productID}`);
    expect(response.status).toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Product not found');
  });
  it("Should validate a valid ID in the URL", async () => {
    const response = await request(server).get("/not-valid-url");
    expect(response.status).toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('ID not valid');
  });
  it("GET a JSON response for a single product", async () => {
    const response = await request(server).get("/1");
    expect(response.status).toBe(200);
    expect(response.status).not.toBe(404);
    expect(response.body).toHaveProperty('data');
    expect(response.body).not.toHaveProperty('errors');
    expect(response.body).not.toHaveProperty('error');
  })
});

describe("PUT /:id", () => {
  it('should check a valid ID in the URL', async () => {
    const response = await request(server)
                        .put('/not-valid-url')
                        .send({
                            name: "Monitor Curvo",
                            availability: true,
                            price : 300,
                        })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('ID not valid')
})

it('should display validation error messages when updating a product', async() => {
    const response = await request(server).put('/1').send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(4)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
}) 

it('should validate that the price is greater than 0', async() => {
    const response = await request(server)
                            .put('/1')
                            .send({
                                name: "Monitor Curvo",
                                availability: true,
                                price : 0
                            })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Price can not be negative')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
}) 

it('should return a 404 response for a non-existent product', async() => {
    const productId = 2000
    const response = await request(server)
                            .put(`/${productId}`)
                            .send({
                                name: "Monitor Curvo",
                                availability: true,
                                price : 300
                            })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Product not found')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
}) 

it('should update an existing product with valid data', async() => {
    const response = await request(server)
                            .put(`/1`)
                            .send({
                                name: "Monitor Curvo",
                                availability: true,
                                price : 300
                            })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')

    expect(response.status).not.toBe(400)
    expect(response.body).not.toHaveProperty('errors')
}) 

});
