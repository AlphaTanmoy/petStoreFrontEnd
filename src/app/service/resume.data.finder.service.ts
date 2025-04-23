import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { accessTokens } from '../utils/apikey.secrect'; //add this when need data for github

@Injectable({
  providedIn: 'root'
})
export class ResumeDataFinderService {

  private readonly GITHUB_API = 'https://api.github.com/graphql';
  //private readonly TOKEN = accessTokens.git_hub_access_token; //uncomment this if we need data
  private readonly TOKEN = 'MOLLAR_MKC';
  private userName = 'AlphaTanmoy'
  constructor(private http: HttpClient) { }


  getGithubData(): Observable<any> {
    const query = `
      query {
        user(login: "${this.userName}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
          }
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
            nodes {
              name
              isPrivate
              stargazerCount
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.TOKEN}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.GITHUB_API, { query }, { headers });
  }

  getLeetcodeData(): Observable<any> {
    return this.http.get(`https://leetcode-stats-api.herokuapp.com/Alpha_Tanmoy`);
  }

}
