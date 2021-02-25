const graphql = require('graphql');

const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');

// const usersData = [
//   { id: '1', name: 'まんこ', age: 36, profession: 'Programmer' },
//   { id: '13', name: 'まん', age: 26, profession: 'Baker' },
//   { id: '211', name: 'まこ', age: 16, profession: 'Mechanic' },
//   { id: '19', name: 'んこ', age: 26, profession: 'Painter' },
//   { id: '150', name: 'ちんこ', age: 36, profession: 'Teacher' },
// ];

// const hobbiesData = [
//   { id: '1', title: 'まんこ', profession: 'Programmer', userId: '13' },
//   { id: '13', title: 'まん', profession: 'Baker', userId: '211' },
//   { id: '211', title: 'まこ', profession: 'Mechanic', userId: '211' },
//   { id: '19', title: 'んこ', profession: 'Painter', userId: '13' },
//   { id: '150', title: 'ちんこ', profession: 'Teacher', userId: '150' },
// ];

// const postsData = [
//   { id: '1', comment: 'Programmer', userId: '1' },
//   { id: '13', comment: 'Baker', userId: '1' },
//   { id: '211', comment: 'Mechanic', userId: '19' },
//   { id: '19', comment: 'Painter', userId: '211' },
//   { id: '150', comment: 'Teacher', userId: '1' },
// ];

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql;

// Create types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        // return postsData.filter((data) => data.userId === parent.id);
        return Post.find({});
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return hobbiesData.filter((data) => data.userId === parent.id);
        return Hobby.find({});
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Hobby description',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return usersData.find((data) => data.id === parent.userId);
        return User.findById(parent.userId);
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post description',
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return usersData.find((data) => data.id === parent.userId);
        return User.findById(parent.userId);
      },
    },
  }),
});

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        // return usersData.find((data) => data.id === args.id);
        return User.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        // return usersData;
        return User.find({});
      },
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        // return hobbiesData.find((data) => data.id === args.id);
        return Hobby.findById(args.id);
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return hobbiesData;
        return Hobby.find({});
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        // return postsData.find((data) => data.id === args.id);
        return Post.findById(args.id);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        // return postsData;
        return Post.find({});
      },
    },
  },
});

//Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    CreateUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        let user = new User({
          // id: {type: GraphQLID},
          name: args.name,
          age: args.age,
          profession: args.profession,
        });

        // save to our db
        return user.save();
      },
    },

    UpdateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        return (updatedUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true }
        ));
      },
    },

    RemoveUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let removedUser = User.findByIdAndRemove(args.id).exec();

        if (!removedUser) {
          throw new 'Error'();
        }

        return removedUser;
      },
    },

    CreatePost: {
      type: PostType,
      args: {
        // id: {type: GraphQLID},
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let post = new Post({
          comment: args.comment,
          userId: args.userId,
        });

        return post.save();
      },
    },

    UpdatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },

      resolve(parent, args) {
        return (updatedPost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
            },
          },
          { new: true }
        ));
      },
    },

    RemovePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let removedPost = Post.findByIdAndRemove(args.id).exec();

        if (!removedPost) {
          throw new 'Error'();
        }

        return removedPost;
      },
    },

    CreateHobby: {
      type: HobbyType,
      args: {
        // id: {type: GraphQLID},
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let hobby = new Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });

        return hobby.save();
      },
    },

    UpdateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },

      resolve(parent, args) {
        return (updatedHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          { new: true }
        ));
      },
    },

    RemoveHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let removedHobby = Hobby.findByIdAndRemove(args.id).exec();

        if (!removedHobby) {
          throw new 'Error'();
        }

        return removedHobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
