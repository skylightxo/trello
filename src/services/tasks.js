// import * as firebaseImp from 'firebase';

import { firebase } from '../firebase';
import { FirestoreCollections } from '../enums/firestoreCollections';
import { TagsService, tagsService } from './tags';

import * as data from '../mocks';

export class TasksService {
  /** @type { TagsService } */
  tagsService;
  firebase;

  constructor(tagsService, firebase) {
    /** Dependencies */
    this.tagsService = tagsService;
    this.firebase = firebase;
    this.firestore = firebase.firestore();
  }

  filterTasks(searchString, task) {
    function searchWithTitle(searchString, { title }) {
      return !!title.match(new RegExp(searchString, 'i'));
    }

    function searchWithDescription(searchString, { description }) {
      return !!description.match(new RegExp(searchString, 'i'));
    }

    function searchWithTags(searchString, { tags }) {
      return tags.some(({ title }) => !!title.match(new RegExp(searchString, 'i')));
    }

    const args = [searchString, task];

    return searchWithTitle(...args) || searchWithDescription(...args) || searchWithTags(...args);
  }

  async getTaskById(taskId) {
    const task = this._getMockTasks().find((task) => task.id === taskId);

    return task;
  }

  async getAllTasks() {
    // const tasks = this._getMockTasks();
    const tasks = await this._getAllTasksFromFirestore();

    /** Resolve all tag refs */
    await Promise.all(
      tasks.map(async (task) => {
        const tagIds = task.tags;
        const tags = await Promise.all(tagIds.map(async (tagId) => await this.tagsService.getTagById(tagId)));

        task.tags = tags;
      }),
    );

    // debugger;
    return tasks;
  }

  async createTask(createObj) {
    if (createObj.tags) {
      createObj.tags = createObj.tags.map((tagId) => this.firestore.collection(FirestoreCollections.Tags).doc(tagId));
    }

    const result = await this.firestore.collection(FirestoreCollections.Tasks).add(createObj);

    return result;
  }

  async updateTaskById(taskId, updateObj) {
    if (updateObj.tags) {
      updateObj.tags = updateObj.tags.map((tagId) => this.firestore.collection(FirestoreCollections.Tags).doc(tagId));
    }

    await this.firestore.collection(FirestoreCollections.Tasks).doc(taskId).update(updateObj);
  }

  async removeTaskById(taskId) {
    await this.firestore.collection(FirestoreCollections.Tasks).doc(taskId).delete();
  }

  async _getAllTasksFromFirestore() {
    const querySnapshot = await this.firestore.collection(FirestoreCollections.Tasks).get();

    const tasks = querySnapshot.docs.map((docRef) => {
      const task = docRef.data();
      const tagIds = task.tags.map((tag) => tag.id);

      return {
        ...task,
        id: docRef.id,
        tags: tagIds,
      };
    });
    return tasks;
    return this._getMockTasks();
  }

  _getMockTasks() {
    return data.tasks;
  }
}

export const tasksService = new TasksService(tagsService, firebase);
