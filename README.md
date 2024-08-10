# Ivory Shield Subgraph

Sample Query:

```
{
  resourceContents {
    id
    name
    content
    contentHash
    type
    isScamCount
    notScamCount
  }
  voteContents {
    id
    resourceId
    isScam
    reason
    info

  }
}
```
