export interface RootState {
  clarification: string,
  alertStuff: {
    slogan: string,
    suffix: string,
    yesFunction: any,
    functionArgument: any,
  },
  besideData: {
    projectDescription: {
      projectPurpose: string
      technologies: string[],
      Methodologies: string[],
      Functionalities: string[],
      contacts: {
        name: string,
        email: string,
        phone: string
      }
    }
  }
}

