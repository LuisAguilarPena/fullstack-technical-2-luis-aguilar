import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DetailField } from './DetailField';

describe('DetailField', () => {
  it('renders the label and text value as a description term and definition', () => {
    render(
      <dl>
        <DetailField label="Reference" value="INV-2026-0454" />
      </dl>,
    );

    expect(screen.getByText('Reference').tagName).toBe('DT');
    expect(screen.getByText('INV-2026-0454').tagName).toBe('DD');
  });
});
