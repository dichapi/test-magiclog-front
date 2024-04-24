
export const signUp = (values) => {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...values })
          };
          
          fetch("https://us-central1-test-magiclog.cloudfunctions.net/admin/sign-up", requestOptions).then(res => res.json()).then(data => {
            resolve(data);
          }).catch(err => {
            console.error("Error al crear cuenta: ", err);
            reject(false);
          });
    })
}