// import * as firebaseImp from 'firebase';

import { firebase } from '../firebase';
import { FirestoreCollections } from '../enums/firestoreCollections';

import * as data from '../mocks';

export class TagsService {
  constructor(firebase) {
    /** Dependencies */
    this.firebase = firebase;
    this.firestore = firebase.firestore();
  }

  async getTagById(tagId) {
    const documentSnapshot = await this.firestore.collection(FirestoreCollections.Tags).doc(tagId).get();

    const task = { ...documentSnapshot.data(), id: documentSnapshot.id };

    return task;
    return this._getMockTags().find((tag) => tag.id === tagId);
  }

  async getAllTags() {
    // const tags = this._getMockTags();
    const tags = await this._getAllTagsFromFirestore();
    return tags;
  }

  async _getAllTagsFromFirestore() {
    const querySnapshot = await this.firestore.collection(FirestoreCollections.Tags).get();
    const tags = querySnapshot.docs.map((docRef) => {
      const tag = { ...docRef.data(), id: docRef.id };
      return tag;
    });
    return tags;
  }

  _getMockTags() {
    return data.tags;
  }
}

export const tagsService = new TagsService(firebase);
