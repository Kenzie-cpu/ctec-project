export async function handler(event: string, context: string){
    console.log('Stage name is: ' + process.env.stage)
    return{
        body: "Hello from a lambda function",
        statuscode: 200
    }
}