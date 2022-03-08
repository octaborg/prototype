# OCTA Prototype Data Repository

## Usage

Simply run

```
npm run dev
```

I made the protobuf message definitions using [types-as-schema](https://www.npmjs.com/package/types-as-schema)

generate a secret identity

```
npm run identity
```

### Producing a signature

```
curl -X GET \
  http://127.0.0.1:6060/api/statement/sign/
```

Check headers for `s`, `r`, `x` and `y`.

### Verifying signature

```
curl -X POST \
  http://127.0.0.1:6060/api/statement/verify/ \
  -H 'r: 23382549827258807343441558431627357150506254847627513526700232018278276868392' \
  -H 's: 3731716699735328896172642992264607850758985845616052018809193997510176013263' \
  -H 'x: 6593512490016519641306090621328677970727886495409708517080412864571159483879' \
  -H 'y: 18389716606550903690263888571357944305390865801207581155180775587471033510853' \
  -d '<payload here>'
```

## Some links

1. https://protobufjs.github.io/protobuf.js/
2. https://www.section.io/engineering-education/how-to-create-a-simple-rest-api-using-typescript-and-nodejs/
