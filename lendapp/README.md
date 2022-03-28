# Mina Snapp: demonstrate serialization issue in the browser

## Run via node

```sh
node --loader ts-node/esm ./try_serialization_reproduce.ts 
```

expected output is

```
0
1242
[ '0', '1242' ]
deserialization of ExampleCircuit succeeded
0
1242
0
1242
[ '0', '1242' ]
deserialization of AnotherCircuit succeeded
0
1242
```

## Run in the browser

```sh
npm run serve
```

then open http://127.0.0.1:3000 in your browser and check console logs. Instead of the above output you should get:

```
0
1242
[ '0', '1242' ]
deserialization of ExampleCircuit failed
0
1242
[ '0', '1242' ]
deserialization of AnotherCircuit failed
```

## License

[Apache-2.0](LICENSE)
