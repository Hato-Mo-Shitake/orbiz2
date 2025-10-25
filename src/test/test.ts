// type Gender = "male" | "female" | "nonBinary";

// interface Person {
//     name: string;
//     age: number;
//     gender: Gender;
// }

// class Student implements Person {
//     constructor(
//         readonly name: string,
//         readonly age: number,
//         readonly gender: Gender
//     ) { }

//     study() {
//         console.log(`${this.name} studies!`);
//     }
// }

// class Worker implements Person {
//     constructor(
//         readonly name: string,
//         readonly age: number,
//         readonly gender: Gender,
//         readonly job: string
//     ) { }

//     work() {
//         console.log(`${this.name} works as ${this.job}!`);
//     }
// }

// function listMen(people: Person[]) {
//     people.forEach(p => {
//         if (p.gender === "male") {
//             console.log(`name: ${p.name}, age: ${p.age}`);
//         }
//     });
// }