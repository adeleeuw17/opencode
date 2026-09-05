FROM oven/bun:1.3

RUN apt-get update && apt-get install -y --no-install-recommends \
      curl ca-certificates git xz-utils \
    && curl https://qlty.sh | bash \
    && chmod o+x /root \
    && chmod -R o+rX /root/.qlty \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.qlty/bin:${PATH}"