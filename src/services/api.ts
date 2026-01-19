import type { Project, User, ClientProfile, Student } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper to handle responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response.json();
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_URL}/projects`);
  return handleResponse(response);
};

export const createProject = async (project: Project): Promise<Project> => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  return handleResponse(response);
};

export const updateProject = async (project: Project): Promise<Project> => {
  const response = await fetch(`${API_URL}/projects/${project.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  return handleResponse(response);
};

export const deleteProject = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Users
export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`);
  return handleResponse(response);
};

export const createUser = async (user: User): Promise<User> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
};

export const updateUser = async (user: User): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Students
export const getStudents = async (): Promise<Student[]> => {
  const response = await fetch(`${API_URL}/students`);
  return handleResponse(response);
};

export const createStudent = async (student: Student): Promise<Student> => {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  return handleResponse(response);
};

export const updateStudent = async (student: Student): Promise<Student> => {
  const response = await fetch(`${API_URL}/students/${student.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  return handleResponse(response);
};

export const deleteStudent = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Institutions (Clients in App state)
// Stored as { id: string, name: string } in DB, but App uses string[]
export const getInstitutions = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/institutions`);
  const data = await handleResponse(response);
  return data.map((d: any) => d.name);
};

export const createInstitution = async (name: string): Promise<string> => {
  const response = await fetch(`${API_URL}/institutions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }), // Server generates ID
  });
  const data = await handleResponse(response);
  return data.name;
};

export const deleteInstitution = async (name: string): Promise<void> => {
  // Find ID first
  const searchRes = await fetch(`${API_URL}/institutions?name=${encodeURIComponent(name)}`);
  const searchData = await handleResponse(searchRes);
  
  if (searchData.length > 0) {
    const response = await fetch(`${API_URL}/institutions/${searchData[0].id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};

// Project Types
export const getProjectTypes = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/projectTypes`);
  const data = await handleResponse(response);
  return data.map((d: any) => d.name);
};

export const createProjectType = async (name: string): Promise<string> => {
  const response = await fetch(`${API_URL}/projectTypes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await handleResponse(response);
  return data.name;
};

export const deleteProjectType = async (name: string): Promise<void> => {
  const searchRes = await fetch(`${API_URL}/projectTypes?name=${encodeURIComponent(name)}`);
  const searchData = await handleResponse(searchRes);
  
  if (searchData.length > 0) {
    const response = await fetch(`${API_URL}/projectTypes/${searchData[0].id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};

// Servers
export interface Server {
  id: string;
  name: string;
  specs: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
}

export const getServers = async (): Promise<Server[]> => {
  const response = await fetch(`${API_URL}/servers`);
  return handleResponse(response);
};

export const createServer = async (server: Server): Promise<Server> => {
  const response = await fetch(`${API_URL}/servers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(server),
  });
  return handleResponse(response);
};

export const updateServer = async (server: Server): Promise<Server> => {
  const response = await fetch(`${API_URL}/servers/${server.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(server),
  });
  return handleResponse(response);
};

export const deleteServer = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/servers/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Client Profiles
export const getClientProfiles = async (): Promise<ClientProfile[]> => {
  const response = await fetch(`${API_URL}/clientProfiles`);
  return handleResponse(response);
};

export const createClientProfile = async (profile: ClientProfile): Promise<ClientProfile> => {
  const response = await fetch(`${API_URL}/clientProfiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  return handleResponse(response);
};

export const updateClientProfile = async (profile: ClientProfile): Promise<ClientProfile> => {
  const response = await fetch(`${API_URL}/clientProfiles/${profile.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  return handleResponse(response);
};

export const deleteClientProfile = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/clientProfiles/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};
