class APIFeatures {
  // constructor: create an object from Mongoose query for reusability, and queryString getting from Express from the routes
  constructor(query, queryStringFromExpress) {
    this.queryForMongoose = query; // actually our model that we're gonna query
    this.queryStringFromExpress = queryStringFromExpress;
  }

  filter() {
    // we need a hard copy here because don't want to modify the original req.query
    const queryObj = {
      ...this.queryStringFromExpress
    };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields'
    ];
    excludedFields.forEach(
      (field) => delete queryObj[field]
    );

    // Advanced filtering for greater than, lesser than
    let filteredQueryStr = JSON.stringify(
      queryObj
    );
    filteredQueryStr = filteredQueryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.queryForMongoose = this.queryForMongoose.find(
      JSON.parse(filteredQueryStr)
    );

    return this;
  }

  sort() {
    if (this.queryStringFromExpress.sort) {
      const sortBy = this.queryStringFromExpress.sort
        .split(',')
        .join(' ');
      this.queryForMongoose = this.queryForMongoose.sort(
        sortBy
      ); // to achieve this format query.sort('price ratingsAverage)
    } else {
      this.queryForMongoose = this.queryForMongoose.sort(
        '-createdAt'
      );
    }

    return this; // give access to the modified object
  }

  limitFields() {
    if (this.queryStringFromExpress.fields) {
      const fields = this.queryStringFromExpress.fields
        .split(',')
        .join(' '); // join with a space
      this.queryForMongoose = this.queryForMongoose.select(
        fields
      );
    } else {
      this.queryForMongoose = this.queryForMongoose.select(
        '-__v'
      ); //add minus sign to include everything except the __v
    }

    return this;
  }

  paginate() {
    const page =
      this.queryStringFromExpress.page * 1 || 1;
    const limit =
      this.queryStringFromExpress.limit * 1 ||
      100;
    const skip = (page - 1) * limit;
    this.queryForMongoose = this.queryForMongoose
      .skip(skip)
      .limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
