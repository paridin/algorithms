
const input = `2
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
      return {
        type: line[0],
        x: line[1],
        y: line[2],
        z: line[3],
        W: line[4]
      }
    case 'QUERY':
      return {
        type: line[0],
        x1: line[1],
        y1: line[2],
        z1: line[3],
        x2: line[4],
        y2: line[5],
        z2: line[6]
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

/**
 * Fenwick 3D matrix
 */
const fenwick3DTree = dimension => {

}

const validate = (value, condition) => {
  return 1 <= value && value <= condition
}

const init = input => {
  const buffer = input
                  .split('\n')
                  .map(line => line.replace('\r', ''))

  const T = buffer.shift()
  if (validate(T, 50)) { // rule 1 : 1 <= T <= 50 
    const testCases = mapping(buffer) // TEST: assert T === testCases.length
    
    testCases.each(test => {
      if (validate(test.dimension, 100) && 
          validate(test.size, 1000)) { // rules 2: 1 <= N <= 100, 3: 1 <= M <= 1000
            // create a matrix
      }
    })
    
    console.log(T, JSON.stringify(testCases, null, 2) )
  }  
}

init(input)