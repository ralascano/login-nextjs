import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";


const secredKey = "secret";
const key = new TextEncoder().encode(secredKey)

export const getSession = async () => {
    const session = cookies().get('session')?.value;
    if (!session) return null;
    return await decrypt(session)
} 

export const decrypt = async (input) => {
    const {payload} = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    })
    return payload
}


export const login = async (formData) => {
    const user = {email: formData.get("email"), name: "John"}

    const url = "https://salert-api-test.socialsalert.com/auth/login"
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "usuario": "rlascano@golden-companies.com",
            "clave": "root123",
            "ip": "186.4.176.175",
            "location": "Quito, P, Ecuador",
            "hostName": "host-186-4-176-175.netlife.ec",
            "isp": "Telconet S.A",
            "countryCode": "EC",
            "torExit": "",
            "domain": "alert"
        }),
      });
    
      const responseData = await response.json();

      console.log(responseData)



    const expires = new Date(Date.now() + 10 *1000)
    const session = await encrypt({responseData, expires});

    console.log(session)




    cookies().set("session", session, {expires, httpOnly: true})
}

export const encrypt = async (payload) => {
    return await new SignJWT(payload)
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export const logout = () => {
    cookies().set("session", "", {expires: new Date(0)});
}