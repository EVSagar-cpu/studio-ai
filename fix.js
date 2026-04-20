const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(
  'if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;\n\n  // Global styles',
  '// Global styles'
);
code = code.replace(
  'const View = views[view];\n\n  return (',
  'const View = views[view];\n\n  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;\n\n  return ('
);
fs.writeFileSync('src/App.jsx', code);
console.log('Done');
