const uuidTemplate = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;


function validateUuid(str: string): boolean {
  return uuidTemplate.test(str);
}

export {
  validateUuid
}