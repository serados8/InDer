{
  const ts = require('typescript');
  const { readFileSync } = require('node:fs');
  require.extensions['.ts'] = (module, filename) => {
    const output = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    const compiled = module as NodeModule & { _compile: (code: string, name: string) => void };
    compiled._compile(output.outputText, filename);
  };
}
