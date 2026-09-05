FROM oven/bun:1.3

RUN apt-get update && apt-get install -y --no-install-recommends \
      curl ca-certificates git xz-utils \
    && curl https://qlty.sh | bash \
    && chmod o+x /root \
    && chmod -R o+rX /root/.qlty \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.qlty/bin:${PATH}"