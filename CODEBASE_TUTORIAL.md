# Beginner Tutorial: Understanding This Next.js Portfolio

This project is a personal portfolio website for Hendrik Oosthuizen. It has two main parts:

1. A portfolio page with sections about Hendrik's work and experience.
2. A "Digital Twin" chat that answers questions about his career.

The project uses:

- **Next.js**: A framework for building React websites and server code.
- **React**: A library for building user interfaces from components.
- **TypeScript**: JavaScript with type checking.
- **CSS**: The styling for the page.
- **OpenRouter**: The external AI service used by the chat.

---

## 1. The project structure

Here is the important part of the project:

```text
site/
|-- app/
|   |-- layout.tsx
|   |-- page.tsx
|   |-- globals.css
|   |-- components/
|   |   |-- DigitalTwinChat.tsx
|   |-- api/
|       |-- chat/
|           |-- route.ts
|-- next.config.ts
|-- package.json
|-- tsconfig.json
```

### What each file does

| File | Purpose |
|---|---|
| `app/layout.tsx` | The outer layout shared by the website. It also sets the page title and description. |
| `app/page.tsx` | The main portfolio page. It contains the visible sections and page content. |
| `app/globals.css` | The global styles, responsive rules, colors, spacing, and animations. |
| `app/components/DigitalTwinChat.tsx` | The interactive chat window in the browser. |
| `app/api/chat/route.ts` | The server-side API route that talks to the AI service. |
| `next.config.ts` | Next.js configuration. |
| `package.json` | Project information, scripts, and installed packages. |
| `tsconfig.json` | TypeScript rules for the project. |

A useful rule is:

> Files in `app/` describe pages and routes. Components describe pieces of the interface. CSS controls appearance.

---

## 2. How to run the project

Install dependencies once:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local address shown in the terminal, usually:

```text
http://localhost:3000
```

The other scripts are:

```bash
npm run lint   # Checks TypeScript without creating build files
npm run build  # Creates a production build
npm run start  # Starts the production build
```

In this project, the `lint` script runs `tsc --noEmit`. That means TypeScript checks the code, but does not write compiled JavaScript files.

---

## 3. What happens when the website opens?

The starting point is `app/layout.tsx`.

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Breaking this down

- `export default` makes this function available to Next.js.
- `RootLayout` is the main wrapper for the application.
- `children` means "whatever page is inside this layout."
- `<html>` and `<body>` are normal HTML elements written in JSX.
- `{children}` inserts the current page into the body.

This file also imports the global stylesheet:

```tsx
import "./globals.css";
```

It defines metadata too:

```tsx
export const metadata: Metadata = {
  title: "Hendrik Oosthuizen | Operations & SaaS Delivery Leader",
  description: "...",
};
```

Metadata is information used by the browser and search engines. The title usually appears in the browser tab.

After the layout is loaded, Next.js renders `app/page.tsx` as the home page.

---

## 4. The main portfolio page

The main page starts by importing the chat component:

```tsx
import DigitalTwinChat from "./components/DigitalTwinChat";
```

It also defines two small icon components:

```tsx
const ArrowUpRight = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5 15 15 5M7 5h8v8" />
  </svg>
);
```

This is a React component that returns an SVG icon. Keeping the icon in a component means it can be reused in several places.

The page also stores repeated content in arrays:

```tsx
const impact = [
  { value: "700+", label: "SaaS implementations supported" },
  { value: "40+", label: "Cross-functional team members led" },
];
```

An array is useful here because the page can display each item with `.map()`:

```tsx
{impact.map((item) => (
  <div key={item.label}>
    <strong>{item.value}</strong>
    <span>{item.label}</span>
  </div>
))}
```

### What `.map()` means

`.map()` takes every item in an array and creates something for it. In this example:

1. Take one object from `impact`.
2. Put its `value` into `<strong>`.
3. Put its `label` into `<span>`.
4. Repeat for every object.

The `key` helps React identify each item when the page changes. A key should be stable and unique among the items.

### Sections on the page

The `Home` component contains these main sections:

- Header and navigation
- Hero introduction
- Career impact numbers
- About section
- Career journey timeline
- Areas of expertise
- Education
- Portfolio placeholder
- Contact footer
- Digital Twin chat

HTML `id` attributes such as `about`, `journey`, and `expertise` allow navigation links to jump to sections:

```tsx
<a href="#about">About</a>
```

The link means: find the element whose `id` is `about` and scroll to it.

At the end of the page, the chat is rendered like any other React component:

```tsx
<DigitalTwinChat />
```

---

## 5. The difference between a page and a component

`app/page.tsx` is a page. `DigitalTwinChat.tsx` is a component.

A **page** represents a route that a visitor can open. A **component** is a reusable piece of the interface.

The chat is separated into its own file because it has its own behavior:

- It opens and closes.
- It remembers messages.
- It sends requests.
- It shows loading and error states.
- It has an input field.

Keeping that behavior in its own component makes `page.tsx` easier to read.

---

## 6. The Digital Twin chat component

The first line is important:

```tsx
"use client";
```

Next.js can render some components on the server by default. The chat needs browser features such as clicks, keyboard events, focus, and `fetch`, so it must be a **Client Component**.

The component imports React tools:

```tsx
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
```

### The message type

```tsx
type Message = {
  role: "user" | "assistant";
  content: string;
};
```

This describes what a chat message must look like.

- `role` can only be `user` or `assistant`.
- `content` must be text.

TypeScript can now warn us if we accidentally create an invalid message.

### React state

The component stores changing values with `useState`:

```tsx
const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

Each pair has:

- A current value, such as `open`.
- A function that changes it, such as `setOpen`.

For example:

```tsx
setOpen(true);
```

changes the chat from closed to open. When state changes, React renders the component again with the new values.

### References with `useRef`

```tsx
const endRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLTextAreaElement>(null);
```

A ref points to a real HTML element without causing a re-render when the ref changes.

This code uses refs to:

- Scroll to the newest message.
- Focus the text area when the chat opens.

### Effects with `useEffect`

The first effect scrolls the message area when messages or loading status changes:

```tsx
useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);
```

The array at the end is called the dependency list. The effect runs again when `messages` or `loading` changes.

The `?.` is optional chaining. It means: call `scrollIntoView` only if `endRef.current` exists.

The second effect focuses the input when the panel opens:

```tsx
useEffect(() => {
  if (open) window.setTimeout(() => inputRef.current?.focus(), 100);
}, [open]);
```

---

## 7. What happens when someone sends a chat question?

The important function is `ask`:

```tsx
async function ask(question: string) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion || loading) return;

  const nextMessages = [
    ...messages,
    { role: "user", content: cleanQuestion },
  ];

  setMessages(nextMessages);
  setInput("");
  setError("");
  setLoading(true);
```

### Step by step

1. `trim()` removes spaces at the beginning and end.
2. Empty questions are ignored.
3. A new user message is added to the existing messages.
4. The input box is cleared.
5. An old error is cleared.
6. `loading` becomes `true`, which disables sending another question.

The three dots before `messages` are the **spread operator**:

```tsx
[...messages, newMessage]
```

It creates a new array containing the old messages and the new message. React state should be replaced with new data instead of changing the old array directly.

### Sending the request

```tsx
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: nextMessages }),
});
```

This sends a `POST` request to the local API route.

- `method: "POST"` says we are sending data.
- The `Content-Type` header says the data is JSON.
- `JSON.stringify` converts a JavaScript object into JSON text.

The browser sends this shape:

```json
{
  "messages": [
    { "role": "user", "content": "What is your leadership style?" }
  ]
}
```

### Handling the answer

```tsx
const data = await response.json();

if (!response.ok || !data.answer) {
  throw new Error(data.error || "Something went wrong.");
}

setMessages((current) => [
  ...current,
  { role: "assistant", content: data.answer },
]);
```

The response is converted from JSON back into a JavaScript object. If the server reports an error, the function throws an error. Otherwise, the assistant's answer is added to the chat.

The `try`, `catch`, and `finally` blocks make the request safer:

- `try`: attempt the request.
- `catch`: show a readable error if it fails.
- `finally`: stop the loading state whether it succeeds or fails.

---

## 8. Form submission and keyboard behavior

The form calls `submit` when the user presses the send button:

```tsx
function submit(event: FormEvent) {
  event.preventDefault();
  void ask(input);
}
```

`preventDefault()` stops the browser from reloading the page, which is the normal behavior for an HTML form.

`void ask(input)` starts the asynchronous function without waiting for it inside the event handler.

The text area also handles the Enter key:

```tsx
if (event.key === "Enter" && !event.shiftKey) {
  event.preventDefault();
  event.currentTarget.form?.requestSubmit();
}
```

This gives the chat familiar behavior:

- Enter sends the question.
- Shift + Enter creates a new line.

---

## 9. The server API route

The browser should not call the AI provider directly because the API key must remain private. Instead, the browser calls the project's own route:

```text
Browser -> /api/chat -> OpenRouter -> /api/chat -> Browser
```

The route file is `app/api/chat/route.ts`.

In Next.js, the folder structure creates the URL:

```text
app/api/chat/route.ts  becomes  /api/chat
```

The route exports a `POST` function:

```tsx
export async function POST(request: NextRequest) {
  // Handle the request here
}
```

This function only handles POST requests.

### Checking the API key

```tsx
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  return NextResponse.json(
    { error: "The Digital Twin is not configured yet." },
    { status: 503 },
  );
}
```

`process.env.OPENROUTER_API_KEY` reads a private environment variable. If it is missing, the route returns a `503` response instead of trying to call OpenRouter.

For local development, the key would normally be stored in a file such as `.env.local`:

```text
OPENROUTER_API_KEY=your_private_key_here
```

Do not commit that file or expose the key in a client component.

### Validating messages

The route uses a helper function:

```tsx
function isChatMessage(value: unknown): value is ChatMessage {
  // Check that the value has the expected shape
}
```

This protects the server from malformed input. It checks that:

- The value is an object.
- The role is `user` or `assistant`.
- The content is a non-empty string.
- The content is no longer than 2,000 characters.

The route also keeps only the last ten messages:

```tsx
const recentMessages = messages.slice(-10);
```

This limits the amount of conversation sent to the AI service.

### Calling OpenRouter

The route sends the verified messages to OpenRouter:

```tsx
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: CAREER_CONTEXT },
      ...recentMessages,
    ],
  }),
});
```

The important idea is that the `system` message comes first. It contains the career facts and rules for the AI, such as:

- Speak as a professional career guide.
- Use only verified facts.
- Do not invent employers or achievements.
- Explain that it is an AI if asked.
- Keep answers concise.

The visitor's conversation is added after that system message.

### Handling provider errors

The route checks `response.ok`. It turns common provider problems into user-friendly messages:

- `401`: The API key is invalid.
- `402`: The OpenRouter account needs credits.
- `429`: Too many questions are being sent.
- Other errors: The service is temporarily unavailable.

It also uses an `AbortController` to stop waiting after 45 seconds. This prevents a request from hanging forever.

Finally, a successful response is returned to the browser:

```tsx
return NextResponse.json({ answer });
```

The chat component reads that `answer` and displays it as an assistant message.

---

## 10. The full chat flow in plain English

When a visitor asks a question:

1. The visitor types into the text area.
2. React stores the text in the `input` state.
3. The form calls `ask(input)`.
4. The chat adds the question to the visible messages.
5. The browser sends the messages to `/api/chat`.
6. The server checks the private API key.
7. The server validates the message format.
8. The server adds the verified career context.
9. The server asks OpenRouter for an answer.
10. OpenRouter returns text.
11. The server sends `{ answer: "..." }` back to the browser.
12. React adds the answer to the message list.
13. The chat scrolls to the newest message.

The key security idea is:

> The browser knows the local `/api/chat` route, but it never receives the OpenRouter API key.

---

## 11. How the CSS works

`app/globals.css` styles the entire website.

At the top, CSS variables define the design colors:

```css
:root {
  --ink: #101a2c;
  --navy: #0c172a;
  --blue: #3d70ff;
  --paper: #f4f1e9;
}
```

A variable can be reused like this:

```css
body {
  color: var(--ink);
  background: var(--paper);
}
```

This makes the palette easier to update later.

The CSS includes:

- Base styles for the whole page.
- Classes for each page section.
- Hover states for links and buttons.
- Animation rules for content appearing on screen.
- Responsive media queries for smaller screens.

A media query changes styles based on screen width:

```css
@media (max-width: 600px) {
  .hero {
    min-height: auto;
  }
}
```

That rule applies only when the viewport is 600 pixels wide or less. This is how the desktop layout becomes mobile-friendly.

The chat styles are grouped near the bottom and use class names beginning with `twin-`, such as:

- `.twin-shell`
- `.twin-trigger`
- `.twin-panel`
- `.twin-message`
- `.twin-form`

The class names connect the JSX elements in `DigitalTwinChat.tsx` to their visual styles in the CSS file.

---

## 12. A simple way to make a change

Suppose you want to change the hero heading.

1. Open `app/page.tsx`.
2. Find the `<h1>` inside the `.hero-copy` section.
3. Change the text.
4. Save the file.
5. Look at the browser. Next.js refreshes the page during development.

Suppose you want to change the hero color.

1. Open `app/globals.css`.
2. Find the `--navy` variable.
3. Change its color value.
4. Save the file.
5. Check the page in the browser.

Suppose you want to change what the Digital Twin knows.

1. Open `app/api/chat/route.ts`.
2. Find the `CAREER_CONTEXT` text.
3. Update only verified information.
4. Save the file.
5. Ask the chat a question to test the change.

---

## 13. Beginner vocabulary

### Component
A reusable piece of a React interface, such as a button, header, or chat window.

### JSX
HTML-like syntax written inside JavaScript or TypeScript.

### Props
Values passed from one component to another. This project does not need many props yet, but they are useful when components need configurable data.

### State
Data that can change while the user interacts with the page. The chat's open/closed state and messages are examples.

### Server route
Code that runs on the server and responds to a URL, such as `/api/chat`.

### API
A way for one program to communicate with another program.

### JSON
A text format commonly used to send structured data between a browser and a server.

### Environment variable
A configuration value stored outside the source code, such as a private API key.

### Type
A description of what kind of value something is. TypeScript uses types to catch mistakes before the application runs.

---

## 14. A good learning order

To learn this project without becoming overwhelmed, read it in this order:

1. Read `app/page.tsx` and identify the page sections.
2. Read `app/layout.tsx` to understand the shared wrapper.
3. Read the relevant CSS classes in `app/globals.css`.
4. Read `DigitalTwinChat.tsx` and focus on state and the `ask` function.
5. Read `app/api/chat/route.ts` and follow the server-side request.
6. Change one piece of text or one color and observe the result.
7. Add a small verified item to an existing array and check that it renders.
8. Run `npm run lint` after each meaningful change.

The most important mental model is:

```text
React component = what the visitor sees and interacts with
API route       = secure server-side work
CSS             = how everything looks
TypeScript      = rules that help prevent mistakes
```
