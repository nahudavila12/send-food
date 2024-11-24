export async function createProduct(productData: unknown) {
    const res = await fetch('https://672f8e2e66e42ceaf15e10ee.mockapi.io/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    const data = await res.json()
    console.log(data);
    
}