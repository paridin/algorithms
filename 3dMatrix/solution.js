/**
 * Problem
 * https://www.hackerrank.com/challenges/cube-summation
 * Created by Roberto Estrada 21/01/17
 */
const demo = `2
4 5
UPDATE 2 2 2 4
QUERY 1 1 1 3 3 3
UPDATE 1 1 1 23
QUERY 2 2 2 4 4 4
QUERY 1 1 1 3 3 3
2 4
UPDATE 2 2 2 1
QUERY 1 1 1 1 1 1
QUERY 1 1 1 2 2 2
QUERY 2 2 2 2 2 2`

const getOperations = (stream, from, to) => {
  const ops = []
  for (let i = from; i <= to; i++) {
    ops.push(stream[i])
  }
  return ops
}

const getInfo = d => ({ dimension: Number(d[0]), size: Number(d[1]) })

const mapStreamToCases = stream => {
  const line = stream.split(' ')
  switch (line[0]) {
    case 'UPDATE':
      return { // because our matrix start in 0 we rest -1 to x,y,z
        type: line[0],
        x: line[1] - 1,
        y: line[2] - 1,
        z: line[3] - 1,
        W: line[4]
      }
    case 'QUERY':
      return {
        type: line[0],
        x1: line[1] - 1,
        y1: line[2] - 1,
        z1: line[3] - 1,
        x2: line[4] - 1,
        y2: line[5] - 1,
        z2: line[6] - 1
      }
  }
}

const mapping = (buffer) => {
  const pattern = /(^UPDATE|^QUERY)/i
  let out = {}
  let index = 0
  for (let j = 0 ; j < buffer.length ; j ++) {
    if (!pattern.test(buffer[j])) {
      const info = getInfo(buffer[j].split(' '))
      const operations = getOperations(buffer, j + 1, j + info.size)
      info['operations'] = operations.map(stream => mapStreamToCases(stream))
      out[index] = info
      index = index + 1 // increment our index for our next test case
    }
  }
  return out
}

const query = (matrix, op) => {
  sum = 0
  for (let x=op.x1; x <= op.x2; x++) {
    for (let y=op.y1; y <= op.y2; y++) {
      for (let z=op.z1; z <= op.z2; z++) {
        sum += Number(matrix[x][y][z])
      }
    }
  }
  return sum
}

const createMatrix = dimension => new Array(dimension).fill(0)
          .map(() => new Array(dimension).fill()
          .map(() => new Array(dimension).fill(0)))

const validate = (value, condition) => (value <= condition)

const init = input => {
  const buffer = input
                  .split('\n')
                  .map(line => line.replace('\r', ''))

  const T = buffer.shift()
  const W = Math.pow(10, 9)
  
  if (validate(T, 50)) { // rule 1 : 1 <= T <= 50 
    const testCases = mapping(buffer) // TEST: assert T === testCases.length
    let results = []
    for (key in testCases) {
      const test = testCases[key]
      if (validate(test.dimension, 100) && 
          validate(test.size, 1000)) { // rules 2: 1 <= N <= 100, 3: 1 <= M <= 1000
            // create a matrix
            const matrix = createMatrix(test.dimension) 
            const result = test.operations.reduce((sum, op) => {
              if (op.type === 'UPDATE'){
                  // update the matrix
                  if (validate(op.x, test.dimension) &&
                      validate(op.y, test.dimension) &&
                      validate(op.z, test.dimension) &&
                      -W <= op.W && op.W <= W ) { // rules 7: 1 <= x,y,z <= N, 8: -10^9 <= W <= 10^9
                        matrix[op.x][op.y][op.z] = op.W
                  } else {
                    console.log('rules 7 or 8 are broken.')
                  }
                  return sum
              } else if (op.type === 'QUERY'){
                  // sum the values
                  let _sum = 0
                  if (validate(op.x1, op.x2) && validate(op.x2, test.dimension) &&
                      validate(op.y1, op.y2) && validate(op.y2, test.dimension) &&
                      validate(op.z1, op.z2) && validate(op.z2, test.dimension)
                  ) {
                    return sum.concat(query(matrix, op))
                  }
                }
            }, [])
            results.push(result)
      }
    }
    return results.reduce((a, b) => a.concat(b), []) // flat arrays
  }
}

function process() {
  const stream = document.getElementById('stream').value
  console.log(stream, typeof stream, stream.length)
  if (stream) {
    input = stream
  } else {
    input = demo
  }
  console.log(input)
  const results = init(input).map(result =>  result) // output resuls
  document.getElementById('result').innerHTML = results
}