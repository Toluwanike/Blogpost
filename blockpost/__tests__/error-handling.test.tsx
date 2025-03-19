import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../vitest.setup';
import Home from '../pages/index';
import PostPage from '../pages/posts/[id]';

// Mock useRouter
vi.mock('next/router', () => ({
  useRouter: () => ({
    query: { id: '1' }
  })
}));

describe('Error Handling', () => {
  describe('Home Page', () => {
    it('should display error message when API call fails', async () => {
      // Override the default handler to simulate an error
      server.use(
        http.get('https://jsonplaceholder.typicode.com/posts', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch posts')).toBeInTheDocument();
      });
    });

    it('should show loading state before data is loaded', () => {
      render(<Home />);
      
      const skeletons = screen.getAllByTestId('loading-skeleton');
      expect(skeletons).toHaveLength(6);
    });
  });

  describe('Post Page', () => {
    it('should display error message when post is not found', async () => {
      server.use(
        http.get('https://jsonplaceholder.typicode.com/posts/:id', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      render(<PostPage />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch post')).toBeInTheDocument();
      });
    });

    it('should display error message on network failure', async () => {
      server.use(
        http.get('https://jsonplaceholder.typicode.com/posts/:id', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<PostPage />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch post')).toBeInTheDocument();
      });
    });
  });
});