# Internationalization (i18n) System

This directory contains the internationalization system for the application, supporting multiple languages and message types.

## Directory Structure

```
i18n/
├── en/                 # English translations
│   ├── error-messages.json
│   └── response-messages.json
├── ms/                 # Malay translations
│   ├── error-messages.json
│   └── response-messages.json
├── i18n.module.ts      # I18n module configuration
├── i18n.service.ts     # Translation service
├── i18n.filter.ts      # Exception filter for translations
├── translation-keys.ts # Enum keys for translations
└── i18n.generated.ts   # Auto-generated types
```

## Adding New Messages

### 1. Add Translation Keys

First, add your new keys to the appropriate translation files in both language directories:

```json
// src/i18n/en/error-messages.json
{
  "new_error": "Your error message in English"
}

// src/i18n/ms/error-messages.json
{
  "new_error": "Your error message in Malay"
}
```

### 2. Add Enum Key

Add the new key to the `ErrorKey` or `ResponseKey` enum in `translation-keys.ts`:

```typescript
export enum ErrorKey {
  // ... existing keys ...
  NEW_ERROR = 'error-messages.new_error',
}
```

### 3. Add Service Method (Optional)

If you want to make the translation easily accessible, add a method to `I18nTranslationService`:

```typescript
async newError(lang?: string): Promise<string> {
  return this.translate(ErrorKey.NEW_ERROR, {}, lang);
}
```

## Using Translations

### Error Messages

```typescript
// Using the service method
const message = await i18nService.newError('ms');

// Using translate directly
const message = await i18nService.translate(ErrorKey.NEW_ERROR, {}, 'ms');
```

### Response Messages

```typescript
// Using the service method
const message = await i18nService.passwordSet('ms');

// Using translate directly
const message = await i18nService.translate(ResponseKey.PASSWORD_SET, {}, 'ms');
```

## Exception Handling

The system automatically translates error messages in exceptions. For example:

```typescript
throw NOT_FOUND('User', { id: 122 });
// Will be translated to:
// English: "User with id: 122 not found"
// Malay: "User dengan id: 122 tidak dijumpai"
```

## Supported Languages

- English (en)
- Malay (ms)

## Configuration

The i18n system is configured in `i18n.module.ts` with:
- Fallback language
- Translation file paths
- Language resolution from headers
- Watch mode for development

## Best Practices

1. Always add translations for all supported languages
2. Use descriptive keys that reflect the message content
3. Keep error messages concise and clear
4. Use placeholders for dynamic content (e.g., `{key}`, `{value}`)
5. Test translations in all supported languages 