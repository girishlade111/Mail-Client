export const labels = [
  { id: 'inbox', name: 'Inbox', icon: 'inbox', color: '#6b6375' },
  { id: 'sent', name: 'Sent', icon: 'send', color: '#22c55e' },
  { id: 'drafts', name: 'Drafts', icon: 'file', color: '#eab308' },
  { id: 'spam', name: 'Spam', icon: 'alert-triangle', color: '#ef4444' },
  { id: 'trash', name: 'Trash', icon: 'trash-2', color: '#6b6375' },
];

export const customLabels = [
  { id: 'work', name: 'Work', icon: 'briefcase', color: '#3b82f6' },
  { id: 'personal', name: 'Personal', icon: 'user', color: '#8b5cf6' },
  { id: 'travel', name: 'Travel', icon: 'map-pin', color: '#f59e0b' },
];

export const contacts = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: null },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: null },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', avatar: null },
  { id: '4', name: 'David Brown', email: 'david@example.com', avatar: null },
  { id: '5', name: 'Emma Davis', email: 'emma@example.com', avatar: null },
];

export const emails = [
  {
    id: '1',
    subject: 'Project Update - Q1 Review',
    body: `Hi team,

I wanted to share the Q1 project status update. We've made significant progress on all fronts:

1. Feature development is 80% complete
2. Bug fixes have reduced issues by 45%
3. User feedback has been overwhelmingly positive

Please review the attached document and let me know if you have any questions.

Best regards,
Alice`,
    from: { name: 'Alice Johnson', email: 'alice@example.com' },
    to: [{ name: 'You', email: 'you@example.com' }],
    date: new Date('2026-03-31T10:30:00'),
    read: false,
    starred: true,
    folder: 'inbox',
    labels: ['work'],
  },
  {
    id: '2',
    subject: 'Meeting Tomorrow at 2pm',
    body: `Hi,

Just a reminder that we have our weekly sync meeting tomorrow at 2pm. Please come prepared with your status updates.

See you there!
Bob`,
    from: { name: 'Bob Smith', email: 'bob@example.com' },
    to: [{ name: 'You', email: 'you@example.com' }],
    date: new Date('2026-03-31T09:15:00'),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: [],
  },
  {
    id: '3',
    subject: 'Re: Design Review Feedback',
    body: `Thanks for sending over the designs! Here are my thoughts:

- The color scheme looks great
- I think we can improve the navigation hierarchy
- Let's discuss the mobile responsiveness in detail

Let me know when you have time to hop on a call.

Cheers,
Carol`,
    from: { name: 'Carol Williams', email: 'carol@example.com' },
    to: [{ name: 'You', email: 'you@example.com' }],
    date: new Date('2026-03-30T16:45:00'),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
  },
  {
    id: '4',
    subject: 'Weekend Plans',
    body: `Hey! Wanted to check if you're free this weekend. There's a new exhibit at the art museum that I've been wanting to see.

Let me know!
David`,
    from: { name: 'David Brown', email: 'david@example.com' },
    to: [{ name: 'You', email: 'you@example.com' }],
    date: new Date('2026-03-30T14:20:00'),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['personal'],
  },
  {
    id: '5',
    subject: 'Draft: Proposal for New Initiative',
    body: `Here's a draft of the proposal for the new initiative. Please review and provide feedback before I send it to the leadership team.

[Proposal content pending...]`,
    from: { name: 'You', email: 'you@example.com' },
    to: [{ name: 'Alice Johnson', email: 'alice@example.com' }],
    date: new Date('2026-03-29T11:00:00'),
    read: true,
    starred: false,
    folder: 'drafts',
    labels: [],
  },
];

export const currentUser = {
  name: 'John Doe',
  email: 'you@example.com',
  avatar: null,
};