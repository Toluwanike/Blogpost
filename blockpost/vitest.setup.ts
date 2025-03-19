import '@testing-library/jest-dom/vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const posts = [
  {
    id: 1,
    title: 'Test Post 1',
    body: 'This is test post 1',
    userId: 1
  },
  {
    id: 2,
    title: 'Test Post 2',
    body: 'This is test post 2',
    userId: 1
  }
];

export const server = setupServer(
  http.get('https://jsonplaceholder.typicode.com/posts', () => {
    return HttpResponse.json(posts);
  }),
  
  http.get('https://jsonplaceholder.typicode.com/posts/:id', ({ params }) => {
    const { id } = params;
    const post = posts.find(p => p.id === Number(id));
    
    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(post);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());