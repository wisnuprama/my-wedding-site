# Config

A config file can be a JSON or TS file. Depending on your requirement, you might need a TS to calculate some configuration during runtime.

Example

```json
{
  "FOOTER_URL": "https://github.com/wisnuprama/my-wedding-site",
  "COPYRIGHT_AUTHOR": "Wisnu Ramadhan",
  "COPYRIGHT_YEAR": 2024
}
```

or

```ts
export default {
  FOOTER_URL: "https://github.com/wisnuprama/my-wedding-site",
  COPYRIGHT_AUTHOR: "Wisnu Ramadhan",
  COPYRIGHT_YEAR: 2024,
};
```
