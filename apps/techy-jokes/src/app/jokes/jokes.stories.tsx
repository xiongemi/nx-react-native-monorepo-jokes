import type { Meta, StoryObj } from '@storybook/react';
import { Jokes } from './jokes';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Jokes> = {
  component: Jokes,
  title: 'Jokes',
};
export default meta;
type Story = StoryObj<typeof Jokes>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to Jokes!/gi)).toBeTruthy();
  },
};
