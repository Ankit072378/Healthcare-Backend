const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

describe('Healthcare Backend API Integration Tests', () => {
  let userToken = '';
  let otherUserToken = '';
  let createdPatientId;
  let createdDoctorId;
  let createdMappingId;

  const testUser = {
    name: 'Dr. Jane Admin',
    email: 'admin.jane@healthcare.org',
    password: 'SecurePassword123!'
  };

  const otherUser = {
    name: 'Nurse John Doe',
    email: 'john.doe@healthcare.org',
    password: 'AnotherSecurePassword456!'
  };

  const testPatient = {
    name: 'Alice Henderson',
    age: 34,
    gender: 'Female',
    contact: '+1-555-019-2831',
    address: '42 Maple Street, Boston, MA',
    medical_history: 'Asthma, Mild Hypertension'
  };

  const testDoctor = {
    name: 'Dr. Robert Smith',
    specialization: 'Cardiology',
    phone: '+1-555-987-6543',
    email: 'dr.robert.smith@hospital.org',
    experience_years: 15
  };

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Authentication APIs (/api/auth)', () => {
    it('should register a new user successfully (POST /api/auth/register/)', async () => {
      const res = await request(app)
        .post('/api/auth/register/')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data.token).toBeDefined();

      userToken = res.body.data.token;
    });

    it('should fail registration with duplicate email (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/auth/register/')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should fail registration with invalid email or short password (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/auth/register/')
        .send({
          name: 'Bad User',
          email: 'invalid-email',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should log in a registered user successfully (POST /api/auth/login/)', async () => {
      const res = await request(app)
        .post('/api/auth/login/')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());

      userToken = res.body.data.token;
    });

    it('should reject login with incorrect password (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/auth/login/')
        .send({
          email: testUser.email,
          password: 'WrongPassword!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should register a secondary user for permission tests', async () => {
      const res = await request(app)
        .post('/api/auth/register/')
        .send(otherUser);

      expect(res.status).toBe(201);
      otherUserToken = res.body.data.token;
    });
  });

  describe('Patient Management APIs (/api/patients)', () => {
    it('should reject creating a patient without authentication (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/patients/')
        .send(testPatient);

      expect(res.status).toBe(401);
    });

    it('should create a patient with authenticated user (POST /api/patients/)', async () => {
      const res = await request(app)
        .post('/api/patients/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testPatient);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(testPatient.name);
      expect(res.body.data.age).toBe(testPatient.age);
      expect(res.body.data.id).toBeDefined();

      createdPatientId = res.body.data.id;
    });

    it('should retrieve all patients created by the authenticated user (GET /api/patients/)', async () => {
      const res = await request(app)
        .get('/api/patients/')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].name).toBe(testPatient.name);
    });

    it('should get details of a specific patient (GET /api/patients/:id/)', async () => {
      const res = await request(app)
        .get(`/api/patients/${createdPatientId}/`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdPatientId);
      expect(res.body.data.name).toBe(testPatient.name);
      expect(res.body.data.creator).toBeDefined();
    });

    it('should update patient details (PUT /api/patients/:id/)', async () => {
      const res = await request(app)
        .put(`/api/patients/${createdPatientId}/`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          contact: '+1-555-999-8888',
          medical_history: 'Asthma under control'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contact).toBe('+1-555-999-8888');
      expect(res.body.data.medical_history).toBe('Asthma under control');
    });

    it('should deny unauthorized user from modifying another users patient (403 Forbidden)', async () => {
      const res = await request(app)
        .put(`/api/patients/${createdPatientId}/`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({
          name: 'Hacked Patient'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 when querying non-existent patient', async () => {
      const res = await request(app)
        .get('/api/patients/999999/')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Doctor Management APIs (/api/doctors)', () => {
    it('should create a doctor (POST /api/doctors/)', async () => {
      const res = await request(app)
        .post('/api/doctors/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testDoctor);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(testDoctor.name);
      expect(res.body.data.specialization).toBe(testDoctor.specialization);
      expect(res.body.data.id).toBeDefined();

      createdDoctorId = res.body.data.id;
    });

    it('should reject creating doctor with duplicate email (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/doctors/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testDoctor);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should retrieve all doctors (GET /api/doctors/)', async () => {
      const res = await request(app)
        .get('/api/doctors/')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should get details of a specific doctor (GET /api/doctors/:id/)', async () => {
      const res = await request(app)
        .get(`/api/doctors/${createdDoctorId}/`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdDoctorId);
      expect(res.body.data.name).toBe(testDoctor.name);
    });

    it('should update doctor details (PUT /api/doctors/:id/)', async () => {
      const res = await request(app)
        .put(`/api/doctors/${createdDoctorId}/`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          experience_years: 16,
          phone: '+1-555-000-1111'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.experience_years).toBe(16);
      expect(res.body.data.phone).toBe('+1-555-000-1111');
    });

    it('should return 404 for non-existent doctor', async () => {
      const res = await request(app)
        .get('/api/doctors/999999/')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Patient-Doctor Mapping APIs (/api/mappings)', () => {
    it('should assign a doctor to a patient (POST /api/mappings/)', async () => {
      const res = await request(app)
        .post('/api/mappings/')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          patient_id: createdPatientId,
          doctor_id: createdDoctorId,
          notes: 'Initial cardiac consultation scheduled.'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.patientId).toBe(createdPatientId);
      expect(res.body.data.doctorId).toBe(createdDoctorId);
      expect(res.body.data.patient).toBeDefined();
      expect(res.body.data.doctor).toBeDefined();

      createdMappingId = res.body.data.id;
    });

    it('should reject assigning the same doctor to the same patient again (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/mappings/')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          patient_id: createdPatientId,
          doctor_id: createdDoctorId
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 when mapping a non-existent patient or doctor', async () => {
      const res = await request(app)
        .post('/api/mappings/')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          patient_id: 999999,
          doctor_id: createdDoctorId
        });

      expect(res.status).toBe(404);
    });

    it('should retrieve all patient-doctor mappings (GET /api/mappings/)', async () => {
      const res = await request(app)
        .get('/api/mappings/')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].patient).toBeDefined();
      expect(res.body.data[0].doctor).toBeDefined();
    });

    it('should get all doctors assigned to a specific patient (GET /api/mappings/:patient_id/)', async () => {
      const res = await request(app)
        .get(`/api/mappings/${createdPatientId}/`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].doctor.id).toBe(createdDoctorId);
      expect(res.body.data[0].doctor.name).toBe(testDoctor.name);
    });

    it('should remove a doctor from a patient (DELETE /api/mappings/:id/)', async () => {
      const res = await request(app)
        .delete(`/api/mappings/${createdMappingId}/`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const verifyRes = await request(app)
        .get(`/api/mappings/${createdPatientId}/`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(verifyRes.body.data.length).toBe(0);
    });

    it('should return 404 when deleting a non-existent mapping', async () => {
      const res = await request(app)
        .delete('/api/mappings/999999/')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Record Deletion Endpoints', () => {
    it('should delete a patient record (DELETE /api/patients/:id/)', async () => {
      const res = await request(app)
        .delete(`/api/patients/${createdPatientId}/`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/api/patients/${createdPatientId}/`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(getRes.status).toBe(404);
    });

    it('should delete a doctor record (DELETE /api/doctors/:id/)', async () => {
      const res = await request(app)
        .delete(`/api/doctors/${createdDoctorId}/`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/api/doctors/${createdDoctorId}/`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(getRes.status).toBe(404);
    });
  });
});
