﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Memoria.DataService.IRepository
{
    public interface IGenericRepository<T> where T : class
    {
        // GET all entities 
        Task<IEnumerable<T>> All();

        // GET by id 
        Task<T> GetById(string id);

        // Add an entity
        Task<bool> Add(T entity);

        // Delete an entity
        Task<bool> Delete(string id);
    }
}
