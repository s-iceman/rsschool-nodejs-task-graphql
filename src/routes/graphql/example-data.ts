const users = [
  {
    firstName: 'Ivan',
    lastName: 'Ivanov',
    email: 'foo@qa.qa',
    subscribedToUserIds: []
  },
  {
    firstName: 'Petr',
    lastName: 'Petrov',
    email: 'bar@qa.qa',
    subscribedToUserIds: []
  },
  {
    firstName: 'Sidor',
    lastName: 'Sidorov',
    email: 'baz@qa.qa',
    subscribedToUserIds: []
  }
];

const posts = [
  {
    title: 'Hello',
    content: 'Hello, world!',
  },
  {
    title: 'Test',
    content: 'test...',
  },
  {
    title: 'Test1',
    content: 'no content',
  },
];


const profile = {
  avatar: 'no',
  sex: 'm',
  birthday: '01.01.1970',
  country: 'Poland',
  street: 'Unk',
  city: 'Gdansk',
  memberTypeId: 'basic',
};


async function patchData(db: any): Promise<void> {
  const userIds = [];
  for (const user of users) {
    const res = await db.users.create(user);
    const userId = res.id;
    for (const post of posts) {
      await db.posts.create({...post, userId})
    }
    if (user.firstName === 'Petr') {
      await db.profiles.create({...profile, userId});
    } 
    userIds.push(userId);
  }
  await db.users.change(userIds[0], {subscribedToUserIds: userIds.slice(1)});
}

export {
  patchData,
}