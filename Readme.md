# OCTA Prototype

This is a prototype built according to the design explained [here](https://github.com/octaborg/proposals/blob/main/OCTA-0.md).

## Running the Prototype Locally

1. First clone the following repo and build.

```
cd ../../
git clone git@github.com:octaborg/octa-types.git
npm install
npm run build
```

2. Now back inside the `lendapp`, run the UI server.
```
npm install && npm run build
npm run serve
```

3. Then run the `transaction-data-repository` by running the following inside that directory.
```
npm install && npm run dev
```

Now you should be able to interact with the UI.
