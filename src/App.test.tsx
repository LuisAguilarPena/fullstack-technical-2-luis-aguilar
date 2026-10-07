import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('App', () => {
  it('lands on the payment queue', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: /payment queue/i })).toBeInTheDocument();
  });
});
