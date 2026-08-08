const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://reqres.in/api';
const API_KEY = process.env.REQRES_API_KEY;

test.describe('reqres.in - User CRUD API flow', () => {

  let createdUserId;
  let createdName;
  let createdJob;

  test('create a user and validate status code + store userId', async ({ request }) => {
    createdName = 'John Doe';
    createdJob = 'QA Engineer';

    const response = await request.post(`${BASE_URL}/users`, {
      headers: { 'x-api-key': API_KEY },
      data: {
        name: createdName,
        job: createdJob,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(createdName);
    expect(body.job).toBe(createdJob);
    expect(body.id).toBeTruthy();

    createdUserId = body.id;
    console.log(`Created user id: ${createdUserId}`);
  });

  test('get the created user and validate the response', async ({ request }) => {
    const idToFetch = (createdUserId && createdUserId <= 12) ? createdUserId : 2;

    const response = await request.get(`${BASE_URL}/users/${idToFetch}`, {
      headers: { 'x-api-key': API_KEY },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toBeTruthy();
    expect(body.data.id).toBe(idToFetch);
    expect(body.data.email).toContain('@');
    expect(body.data.first_name).toBeTruthy();
    expect(body.data.last_name).toBeTruthy();

    console.log(`Fetched user: ${body.data.first_name} ${body.data.last_name} (${body.data.email})`);
  });

  test('update the user name and validate the response', async ({ request }) => {
    const updatedName = 'Jane Doe';
    const idToUpdate = createdUserId || 2;

    const response = await request.put(`${BASE_URL}/users/${idToUpdate}`, {
      headers: { 'x-api-key': API_KEY },
      data: {
        name: updatedName,
        job: createdJob || 'QA Lead',
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe(updatedName);
    expect(body.updatedAt).toBeTruthy();

    console.log(`Updated name to: ${body.name}, at ${body.updatedAt}`);
  });

});
