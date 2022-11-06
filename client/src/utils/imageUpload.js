export const checkImage = (file) => {
    let err = ""
    if(!file) return err = "File does not exist."

    if(file.size > 1024 * 1024) // 1mb
    err = "The largest image size is 1mb."

    if(file.type !== 'image/jpeg' && file.type !== 'image/png' )
    err = "Image format is incorrect."
    
    return err;
}


export const imageUpload = async (images) => {
    let imgArr = [];
    for (let index = 0; index < images.length; index++) {
        console.log('type:',images[index].type);
        if(images[index].type === 'image/png' || images[index].type === 'image/jpeg' || images[index].camera ){
            const formData = new FormData()
            
            if(images[index].camera){
                formData.append("file", images[index].camera)
            }else{
                formData.append("file", images[index])
            }
            
            formData.append("upload_preset", "lqhd2doq")
            formData.append("cloud_name", "pvs")
    
            const res = await fetch("https://api.cloudinary.com/v1_1/pvs/image/upload", {
                method: "POST",
                body: formData
            })
            
            const data = await res.json()
    
            imgArr.push({public_id: data.public_id, url: data.secure_url})
        }else if(images[index].type === 'video/mp4'){
            const formData = new FormData()

          
             
           
                formData.append("file", images[index])
            
            
            formData.append("upload_preset", "lqhd2doq")
            formData.append("cloud_name", "pvs")
    
            const res = await fetch("https://api.cloudinary.com/v1_1/pvs/video/upload", {
                method: "POST",
                body: formData
            })
            
            const data = await res.json()
    
            imgArr.push({public_id: data.public_id, url: data.secure_url})
        }
        
    }
    // for(const item of images){
    //     const formData = new FormData()

    //     if(item.camera){
    //         formData.append("file", item.camera)
    //     }else{
    //         formData.append("file", item)
    //     }
        
    //     formData.append("upload_preset", "lqhd2doq")
    //     formData.append("cloud_name", "pvs")

    //     const res = await fetch("https://api.cloudinary.com/v1_1/pvs/image/upload", {
    //         method: "POST",
    //         body: formData
    //     })
        
    //     const data = await res.json()

    //     imgArr.push({public_id: data.public_id, url: data.secure_url})
    // }
    console.log('imgArr',imgArr);
    return imgArr;
}