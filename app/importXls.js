const excelToJson = require('convert-excel-to-json');
const fs = require('fs')
const {Order, User} = require('./models/user')
module.exports =async function importExcelData2MongoDB(req,res){
    // -> Read Excel File to Json Data
    let filePath = __dirname + '/uploads/' + req.file.filename
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets:[{
            // Excel Sheet Name
            name: 'Sheet1',
  
            // Header Row -> be skipped and will not be present at our result object.
            header:{
               rows: 1
            },
             
            // Mapping columns to keys
            columnToKey: {
                A: 'trackId',
                B: 'trackId',
                C:'trackId'
            }
        }]
    });
  
    // -> Log Excel Data to Console
    console.log(excelData);
    await Order.insertMany(excelData)
    res.send(excelData)
/* 
    userModel.insertMany(jsonObj,(err,data)=>{  
            if(err){  
                console.log(err);  
            }else{  
                res.redirect('/');  
            }  
     }); 
           */   
    fs.unlinkSync(filePath);
}