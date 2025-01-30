import { Injectable } from "@angular/core";
import { Activity } from "../models/activity.model";
import { Observable, from } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { 
    Firestore, 
    collection, 
    query, 
    where, 
    orderBy, 
    getDocs,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    limit,
    startAfter,
    QueryConstraint,
    DocumentData,
    QueryDocumentSnapshot
} from 'firebase/firestore';
import { Paginated } from "../models/paginated.model";

@Injectable({
    providedIn: 'root'
})
export class MyActivitiesFirebaseService {
    private collectionRef;

    constructor(private firestore: Firestore) {
        this.collectionRef = collection(this.firestore, 'activities');
    }

    private async getLastDocumentOfPreviousPage(advenId: string, page: number, pageSize: number): Promise<QueryDocumentSnapshot<DocumentData> | null> {
        if (page <= 1) return null;
        
        const q = query(
            this.collectionRef,
            where('advenId', '==', advenId),
            orderBy('title'),
            limit((page - 1) * pageSize)
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs[snapshot.docs.length - 1];
    }

    getByAdvenId(advenId: string, page: number = 1, pageSize: number = 25): Observable<Paginated<Activity>> {
        return from(this.getLastDocumentOfPreviousPage(advenId, page, pageSize)).pipe(
            map(lastDoc => {
                const constraints: QueryConstraint[] = [
                    where('advenId', '==', advenId),
                    orderBy('title'),
                    limit(pageSize)
                ];

                if (lastDoc) {
                    constraints.push(startAfter(lastDoc));
                }

                return query(this.collectionRef, ...constraints);
            }),
            mergeMap(q => getDocs(q)),
            map(snapshot => {
                const activities = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data['title'],
                        location: data['location'],
                        price: data['price'],
                        description: data['description'],
                        advenId: data['advenId']
                    } as Activity;
                });

                return {
                    page: page,
                    pageSize: pageSize,
                    pages: Math.ceil(snapshot.size / pageSize),
                    data: activities
                } as Paginated<Activity>;
            })
        );
    }

    add(activity: Omit<Activity, 'id'>): Observable<Activity> {
        return from(addDoc(this.collectionRef, activity)).pipe(
            map(docRef => ({
                id: docRef.id,
                ...activity
            }))
        );
    }

    update(id: string, activity: Partial<Activity>): Observable<void> {
        const docRef = doc(this.collectionRef, id);
        return from(updateDoc(docRef, activity));
    }

    delete(id: string): Observable<void> {
        const docRef = doc(this.collectionRef, id);
        return from(deleteDoc(docRef));
    }

    getById(id: string): Observable<Activity | null> {
        const docRef = doc(this.collectionRef, id);
        return from(getDocs(query(this.collectionRef, where('__name__', '==', id)))).pipe(
            map(snapshot => {
                if (snapshot.empty) return null;
                const doc = snapshot.docs[0];
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data['title'],
                    location: data['location'],
                    price: data['price'],
                    description: data['description'],
                    advenId: data['advenId']
                } as Activity;
            })
        );
    }
}