import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: "root",
})
/**
 * Firestore Service connect to DB
 */
export class FirestoreService {

  pageSize = 5;
  public usersShow:any = {};

  userChange: Subject<any> = new Subject<any>()

  constructor(public db: AngularFirestore, private router: Router) {
          this.loadStorage();
          this.userChange.subscribe((value) => {
              //console.log(value);
              localStorage.setItem('users', JSON.stringify(value));
              this.usersShow = value;
          });
  }

  /**
   * Load Storage get users data
   */

  loadStorage(){
      if(localStorage.getItem('users')){
            //console.log(JSON.parse(localStorage.getItem('users')));
            this.usersShow = JSON.parse(localStorage.getItem('users'));
      }else{
            this.usersShow = {};
      }
  }

  /**
   * Save Storage with param:
   * @param documentId
   * @param dataUser object user data
   */

  saveStorage(documentId: any, dataUser: any){
    localStorage.setItem('id', documentId);
    localStorage.setItem('users', JSON.stringify(dataUser));
    this.usersShow = dataUser;
    this.userChange.next(this.usersShow);
  }

 /**
  * create user from param
  * @param user object user form form
  */
  createUserForm(user: any) {
    return this.db.collection("users").add(user);
  }

  /**
   * @param user object
   * get user by user.id
   */
  createUserUID(user: any) {
    return this.db.collection("users").doc(user.id).set(user);
  }

  /**
   * get all Drivers by company
   * @param companyId
   * with role == 3 (Driver)
   */
  getAllDriversByCompany(companyId:any){

    return this.db.collection('users', ref => ref.where( 'companyId', '==', companyId).where("role", "==", "3")).snapshotChanges().pipe(
      map(actions =>
           actions.map(a => {
               const data = a.payload.doc.data() as any;
               const id = a.payload.doc.id;
               return { id, ...data };
           })
    ))

  }


  /**
   * Get Orders By Driver
   * @param companyId
   * @param driverId
   * @param deliverydate
   */
  getOrdersByDriver(companyId:any, driverId:any, deliverydate:any){

    return this.db.collection('companys/'+companyId+'/order', ref => ref.where('driverId', '==', driverId).where('datedelivery','==',deliverydate).where('datedelivery','<=',deliverydate)).get().toPromise();
  }

  //edit user - get
  getUser(documentId: string) {
    return this.db.collection("users").doc(documentId).snapshotChanges().pipe(
      map((changes:any) => {
        const data = changes.payload.data();
        const id = changes.payload.id;
        return { id, ...data };
      }));
  }

  getUserPro(documentId:any){
      return this.db.collection("users").doc(documentId).get().toPromise();
  }



  //UID
  getUserUID(uid: string) {
    return this.db.collection("users", ref=> ref.where('id',"==",uid)).valueChanges().pipe(
      map((changes:any) => {

        //const data = changes.payload.data();
        //const id = changes.payload.id;
        /*localStorage.setItem('id', changes[0].id);
        localStorage.setItem('users', JSON.stringify(changes[0]));
        this.usuario = changes[0];*/
        if(changes.length == 0){
          return false;
        }else{
          this.saveStorage(changes[0].id, changes[0]);
          return true;
        }
      }));
  }




  //Obtiene todos los gatos
  public getUsers() {
    return this.db
      .collection("users", (ref) =>
        ref.orderBy("email", "desc")
      )
      .snapshotChanges();
  }

  public getAllUsers() {
    return this.db
      .collection("users", (ref) =>
        ref.orderBy("email", "desc")
      ).snapshotChanges().pipe(
         map(actions =>
              actions.map(a => {
                  const data = a.payload.doc.data() as any;
                  const id = a.payload.doc.id;
                  return { id, ...data };
              })
      ))
  }

  /*
    return this.db.collection('locations', ref => ref.where( 'regions.' + regionId, '==', true)).snapshotChanges().pipe(
        map(actions =>
             actions.map(a => {
                 const data = a.payload.doc.data() as any;
                 const id = a.payload.doc.id;
                 return { id, ...data };
             })
      ))
       */

      public getAllUsersByCompany(companyId) {

        return this.db
          .collection("users", ref => ref.where( 'companyId', '==', companyId)
          ).snapshotChanges().pipe(
             map(actions =>
                  actions.map(a => {
                      const data = a.payload.doc.data() as any;
                      const id = a.payload.doc.id;
                      return { id, ...data };
                  })
          ))
      }



  //Actualiza un user
  public updateUser(documentId: string, data: any) {
    //localStorage.setItem('id', documentId);
    //localStorage.setItem('users', JSON.stringify(data));
    //this.usuario = data;
    return this.db.collection("users").doc(documentId).set(data, {merge: true});
  }

  public updateProfile(documentId: string, data: any) {
    localStorage.setItem('id', documentId);
    localStorage.setItem('users', JSON.stringify(data));
    //this.usuario = data;
    return this.db.collection("users").doc(documentId).set(data, {merge: true});
  }


  //Delete Users
  public deleteUser(documentId: string) {
        return this.db.collection("users").doc(documentId).delete();
  }


  // ------------------------------ CUSTOMERS ------------------------------

  createCustomer(companyId:any, customer: any) {
    return this.db.collection("companys/"+companyId+"/customers").add(customer);
  }

  getAllCustomerPro(companyId:any) {
    return this.db.collection("companys/"+companyId+"/customers").get().toPromise();
  }


  public getAllCustomers() {
    return this.db.collection("customers", (ref) =>
        ref.orderBy("email", "desc")
      ).snapshotChanges().pipe(
         map(actions =>
              actions.map(a => {
                  const data = a.payload.doc.data() as any;
                  const id = a.payload.doc.id;
                  return { id, ...data };
              })
      ))
  }

  getAllCustomerByCompany(companyId:any){
    return this.db.collection('companys/'+companyId+'/customers').snapshotChanges().pipe(
      map(actions =>
           actions.map(a => {
               const data = a.payload.doc.data() as any;
               const id = a.payload.doc.id;
               return { id, ...data };
           })
   ))
  }




    //edit customer - get
    getCustomer(documentId: string) {
      return this.db.collection("customers").doc(documentId).snapshotChanges().pipe(
        map((changes:any) => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        }));
    }

        //edit customer - get
        getCustomerByCompany(companyId:any, documentId: string) {
          return this.db.collection("companys/"+companyId+"/customers").doc(documentId).snapshotChanges().pipe(
            map((changes:any) => {
              const data = changes.payload.data();
              const id = changes.payload.id;
              return { id, ...data };
            }));
        }


    //Actualiza un customer
    updateCustomerByCompany(companyId: any, documentId: string, data: any) {
      /*localStorage.setItem('id', documentId);
      localStorage.setItem('users', JSON.stringify(data));
      this.usuario = data;*/
      return this.db.collection("companys/"+companyId+"/customers").doc(documentId).set(data);
    }

    updateCustomerByCompanyId(companyId:any, documentId: string, data: any) {
      /*localStorage.setItem('id', documentId);
      localStorage.setItem('users', JSON.stringify(data));
      this.usuario = data;*/
      return this.db.collection("companys/"+companyId+"/customers").doc(documentId).set(data, {merge: true});
    }

      //Delete  Customer
    deleteCustomer(companyId:any, documentId: string) {
       return this.db.collection("companys/"+companyId+"/customers").doc(documentId).delete();
     }

     //****************************REGION******************************** */
     createRegion(companyId:any, region:any) {
      return this.db.collection("companys/"+companyId+"/region").add(region);
    }

    getAllRegionPro(companyId:any) {
       return this.db.collection("companys/"+companyId+"/region").get().toPromise();
    }


    getAllRegion(companyId:any) {
      return this.db.collection("companys/"+companyId+"/region").snapshotChanges().pipe(
           map(actions =>
                actions.map(a => {
                    const data = a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                })
        ))
    }

    deleteRegion(companyId:any, regionId:any){
      return this.db.collection("companys/"+companyId+"/region").doc(regionId).delete();
    }

    /*****************************LOCATIONS********************** */

    getLocationsByRegion(regionId){

      return this.db.collection('locations', ref => ref.where( 'regions.' + regionId, '==', true)).snapshotChanges().pipe(
        map(actions =>
             actions.map(a => {
                 const data = a.payload.doc.data() as any;
                 const id = a.payload.doc.id;
                 return { id, ...data };
             })
      ))
    }
    getAllLocation() {
      return this.db.collection("locations").snapshotChanges().pipe(
           map(actions =>
                actions.map(a => {
                    const data = a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                })
        ));
    }

    getAllLocationPro() {
      return this.db.collection("locations").get().toPromise();
    }

    updateLocation(companyId:any, documentId: string, data: any) {
      /*localStorage.setItem('id', documentId);
      localStorage.setItem('users', JSON.stringify(data));
      this.usuario = data;*/
      return this.db.collection("companys/"+companyId+"/customers").doc(documentId).set(data, {merge: true});
    }


    inside(point, vs) {

      var x = point[0], y = point[1];

      var inside = false;
      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
          var xi = vs[i][0], yi = vs[i][1];
          var xj = vs[j][0], yj = vs[j][1];

          var intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }

      return inside;
    }

    //**********************company**************************************************** */

    createCompany(data: any) {
      return this.db.collection("companys").add(data);
    }

    updateCompany(companyId: string, data: any) {
      /*localStorage.setItem('id', documentId);
      localStorage.setItem('users', JSON.stringify(data));
      this.usuario = data;*/

      return this.db.collection("companys").doc(companyId).set(data, {merge: true});
    }

    updateCompanyNew(companyId: string, data: any) {
      /*localStorage.setItem('id', documentId);
      localStorage.setItem('users', JSON.stringify(data));
      this.usuario = data;*/

      return this.db.collection("companys").doc(companyId).update(data);

    }

    getCompany(companyId:any){
      return this.db.collection("companys").doc(companyId).snapshotChanges().pipe(
        map((changes:any) => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        }));
    }


    getCompanyPro(companyId:any){
      return this.db.collection("companys").doc(companyId).get().toPromise();/* snapshotChanges().pipe(
        map((changes:any) => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        })).toPromise();*/
    }

    /********************************* */

    createOrder(companyId:any, data:any) {
      return this.db.collection("companys/"+companyId+"/order").add(data);
    }


    createOrderRequest(companyId: string, orderId:any, data: any){
      return this.db.collection("companys/"+companyId+"/order").doc(orderId).set(data, {merge: true});
    }


    updateOrder(companyId: string, orderId:any, data: any) {
      return this.db.collection("companys/"+companyId+"/order").doc(orderId).set(data, {merge: true});
    }

    deleteOrder(companyId:any, orderId:any){
      return this.db.collection("companys/"+companyId+"/order").doc(orderId).delete();
    }

    getOrderPro(companyId:any, orderId:any) {
      return this.db.collection("companys/"+companyId+"/order").doc(orderId).get().toPromise();
    }

    getOrder(companyId:any, orderId:any) {
      return this.db.collection("companys/"+companyId+"/order").doc(orderId).snapshotChanges().pipe(
        map((changes:any) => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        }));
    }

    getAllOrders(companyId:any){
      return this.db.collection("companys/"+companyId+"/order").snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
          })
       ))
    }

    getAllOrdersByDate(companyId:any, dateto:any, datefrom:any){
      return this.db.collection("companys/"+companyId+"/order", ref => ref.where( 'datedelivery','>=', dateto).where( 'datedelivery','<=', datefrom)).snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
          })
       ))
    }

    getAllOrdersByDriver(companyId:any, driverId:any, dates:any){
      return this.db.collection("companys/"+companyId+"/order", ref => ref.where( 'driverId','==', driverId).where( 'datedelivery','==', dates)).snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
          })
       ))
    }

    getAllOrdersPending(companyId:any){
      return this.db.collection("companys/"+companyId+"/order", ref => ref.where( 'status', '==', 0)).snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
          })
       ))
    }


    /*******ORDeR BY DATE  */

    getAllOrdersByDateStatus(companyId:any, dates:any, status:any){
      return this.db.collection("companys/"+companyId+"/order", ref => ref.where( 'status','==', status).where( 'datedelivery','==', dates)).snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
          })
       ))
    }

    getAllOrdersGraphics(companyId:any, dates:any){
      return this.db.collection("companys/"+companyId+"/order", ref => ref.where( 'datedelivery','==', dates)).snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
          })
       ))
    }


    getAllOrdersRequest(){
      return this.db.collection("orderRequest").snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
          })
       ))
    }


    /******GRAPHICSA */
    getAllOrdersByDateGraPending(companyId:any, datefrom:any, dateto: any){
      return this.db.collection("companys/"+companyId+"/order", ref => ref.where('datedelivery','>=', datefrom).where('datedelivery','<=', dateto).where('status','==',0)).get().toPromise();

    }

    getAllOrdersByDateGraAssigned(companyId:any, datefrom:any, dateto: any){
      return this.db.collection("companys/"+companyId+"/order", ref => ref.where('datedelivery','>=', datefrom).where('datedelivery','<=', dateto).where('status','==',1)).get().toPromise();

    }

    getAllOrdersByDateGraReject(companyId:any, datefrom:any, dateto: any){
      return this.db.collection("companys/"+companyId+"/order", ref => ref.where('datedelivery','>=', datefrom).where('datedelivery','<=', dateto).where('status','==',3)).get().toPromise();

    }

    getAllOrdersByDateGraDelivered(companyId:any, datefrom:any, dateto: any){
      return this.db.collection("companys/"+companyId+"/order", ref => ref.where('datedelivery','>=', datefrom).where('datedelivery','<=', dateto).where('status','==',2)).get().toPromise();

    }

    /********************************ITEM ************** */

    createItem(companyId:any, data:any) {
      return this.db.collection("companys/"+companyId+"/itemorders").add(data);
    }

    getItem(companyId:any, itemId:any) {
      return this.db.collection("companys/"+companyId+"/itemorders").doc(itemId).snapshotChanges().pipe(
        map((changes:any) => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        }));
    }

    getAllItems(companyId:any){
      return this.db.collection("companys/"+companyId+"/itemorders").snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
          })
       ))
    }

    updateItem(companyId: string, itemId:any, data: any) {
      return this.db.collection("companys/"+companyId+"/itemorders").doc(itemId).set(data, {merge: true});
    }

    deleteItem(companyId:any, itemId:any){
      return this.db.collection("companys/"+companyId+"/itemorders").doc(itemId).delete();
    }




      /*******************************************VEHICLE  ******************************************* */

      createVehicle(companyId:any, data:any) {
        return this.db.collection("companys/"+companyId+"/vehicles").add(data);
      }

      getVehicle(companyId:any, carId:any) {
        return this.db.collection("companys/"+companyId+"/vehicles").doc(carId).snapshotChanges().pipe(
          map((changes:any) => {
            const data = changes.payload.data();
            const id = changes.payload.id;
            return { id, ...data };
          }));
      }



      getAllVehicle(companyId:any){
        return this.db.collection("companys/"+companyId+"/vehicles").snapshotChanges().pipe(
          map(actions =>
            actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                return { id, ...data };
            })
         ))
      }

      updateVehicle(companyId: string, carId:any, data: any) {
        return this.db.collection("companys/"+companyId+"/vehicles").doc(carId).set(data, {merge: true});
      }

      deleteVehicle(companyId:any, carId:any){
        return this.db.collection("companys/"+companyId+"/vehicles").doc(carId).delete();
      }



      getCars(){
        return this.db.collection("vehicles").snapshotChanges().pipe(
          map(actions =>
            actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                return { id, ...data };
            })
         ))
      }

      /*******************************create POLL ********** */

      createPoll(companyId:any, data:any) {
        return this.db.collection("companys/"+companyId+"/poll").add(data);
      }

      /***************************TRACKING*******************************/

      getTrackingById(userId:any, companyId:any, dateStart:any, dateEnd:any){

        //get().toPromise();
        return this.db.collection("companys/"+companyId+"/routes", ref => ref.where('userId','==', userId).orderBy("dateroute", "asc").startAt(dateStart).endAt(dateEnd)).snapshotChanges().pipe(
          map(actions =>
            actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                return { id, ...data };
            })
         ));
      }

      /********request ORder ***************/

      //Delete  Customer App
      deleteCustomerApp(documentId: string) {
        return this.db.collection("client").doc(documentId).delete();
      }

      updateCustomerApp(customerId:any, data: any) {
        return this.db.collection("client").doc(customerId).set(data, {merge: true});
      }

      getAllCustomerApp(){
        return this.db.collection('client').snapshotChanges().pipe(
          map(actions =>
               actions.map(a => {
                   const data = a.payload.doc.data() as any;
                   const id = a.payload.doc.id;
                   return { id, ...data };
               })
       ))
      }

      getRequestOrderClient(){

        //get().toPromise();
        return this.db.collection("orderRequest",  ref => ref.where('status','==', 0)).snapshotChanges().pipe(
          map(actions =>
            actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                return { id, ...data };
            })
         ));
      }

      updateRequestOrder(orderId:any, data: any) {
        return this.db.collection("orderRequest").doc(orderId).set(data, {merge: true});
      }

      deleteRequestOrder(orderId:any){
        return this.db.collection("orderRequest").doc(orderId).delete();
      }


}
