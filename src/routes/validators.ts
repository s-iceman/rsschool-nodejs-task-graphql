import * as alert from 'alert';


const uuidTemplate = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;


function validateUuid(str: string): boolean {
  return uuidTemplate.test(str);
}

function myDebug(data: any): void {
   setTimeout(() => { 
    alert(JSON.stringify(data, null, '\n'));
    }, 500);
}

export {
  validateUuid,
  myDebug
}