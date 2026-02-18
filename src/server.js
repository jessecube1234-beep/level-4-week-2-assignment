import { ensureEnv } from '#utils/env';
import { createApp } from '#app';
import { createRepos } from '#repositories/index';

const env = ensureEnv();
const repos = await createRepos();

const app = createApp({
  repos,
  config: { JWT_SECRET: env.JWT_SECRET },
});

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
