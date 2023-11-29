import type { Meta, StoryObj } from '@storybook/react';
import { Bookmarks } from './bookmarks';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Bookmarks> = {
  component: Bookmarks,
  title: 'Bookmarks',
};
export default meta;
type Story = StoryObj<typeof Bookmarks>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to Bookmarks!/gi)).toBeTruthy();
  },
};
