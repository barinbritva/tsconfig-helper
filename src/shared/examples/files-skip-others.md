Example project file structure:

```
src
├── bye.ts
├── greeter.ts
└── index.ts
```

Content of `tsconfig.json`:

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "files": [
    "src/index.ts"
  ]
}
```

File `index.ts` doesn't use either `bye.ts` nor `greeter.ts`:

```typescript
console.log('index.ts')
```

Only `index.ts` will be compiled. Any other files will be totally skipped. Even though they contain syntax errors. Fot instance `greeter.ts` file does:

`greeter.ts`:

```typescript
function sayHello(name: string): {
                             // missed returning value after :
  console.log('Hello ' + name)
}
```

The result:

```
dist
└── index.js
```
