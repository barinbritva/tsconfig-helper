# 🤖 TsConfig Helper

The tool will help you to debug `tsconfig.json` file of your project.

_The project is at stage of prototype - only a part part of `tsconfig.json` options are supported at the moment._

## 🚀 Getting started

Using through global install:

```bash
npm install -g tsch
tsch tsconfig.json -e
```

Using `npx`:

```bash
npx tsch tsconfig.json -e
```

## ⚙ CLI Options

```bash
tsch --help

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
      --coverage  Show flags coverage status                           [boolean]
  -o, --out       File path to write the result                         [string]
  -e, --explain   Add explanations to output                           [boolean]
  -s, --short     Short explanations instead of verbose                [boolean]
  -i, --ignore    Do not include empty default values such as falsy
                  and empty arrays to result config                    [boolean]
```

## 🗺 Roadmap

* Full options coverage
* Handle more complicated flag relations
* Other useful advices
* Visual Studio Code Plugin

## 🔙 Feedback
Your feedback is really important for the project. Please, use contacts from [my profile](https://github.com/barinbritva) to send your questions, suggestions, help requests and others. Also, feel free to use [issues](https://github.com/barinbritva/tsconfig-helper/issues) section to report bugs and problems.

## 🌟 Credits

The project is bootstrapped using [init-typescript-app](https://github.com/barinbritva/init-typescript-app).

---

MIT, see [LICENSE](https://github.com/barinbritva/tsconfig-helper/blob/master/LICENSE) for the details.
